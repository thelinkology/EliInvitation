/**
 * Christening Invitation — Google Sheets RSVP backend
 * ---------------------------------------------------
 * Paste this whole file into Extensions → Apps Script of your RSVP spreadsheet,
 * then follow docs/SETUP.md (Part A).
 *
 * The invitation website (on Vercel) calls this script from its server with a
 * shared secret. The script:
 *   • looks up one invitation by its code (never returns the whole list),
 *   • enforces each invitation's "Max Guests" limit,
 *   • accepts answers from the shared links (/ and /ninong-ninang), where the
 *     guest types their name — those rows show "(shared link)" as the Code,
 *   • keeps ONE row per invitation (or per name, for shared links) in
 *     "Responses" — resubmitting updates it, so duplicates are never
 *     double-counted, and
 *   • appends every submission to "Log" for history.
 */

var SHEETS = { guests: 'Guests', responses: 'Responses', log: 'Log', summary: 'Summary' };

var GUEST_HEADERS = ['Code', 'Name', 'Type', 'Role', 'Max Guests', 'Contact (private)', 'Notes', 'Invitation Link'];
var RESPONSE_HEADERS = [
  'Code', 'Name', 'Type', 'Attending', 'Guest Count', 'Companions', 'RSVP Message', 'RSVP Updated',
  'Godparent Answer', 'Godparent Message', 'Godparent Updated', 'Submissions'
];
var LOG_HEADERS = ['Timestamp', 'Code', 'Action', 'Details'];

// Column positions (0-based) — keep in sync with the headers above.
var G = { code: 0, name: 1, type: 2, role: 3, max: 4, link: 7 };
var R = {
  code: 0, name: 1, type: 2, attending: 3, count: 4, companions: 5, message: 6, rsvpAt: 7,
  gpAnswer: 8, gpMessage: 9, gpAt: 10, submissions: 11
};

var CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I/L
var CODE_LENGTH = 8;
var MAX_GUESTS_CEILING = 20;
var MAX_MESSAGE = 500;
var MAX_COMPANION = 80;
var MAX_NAME = 80;
/** Code column value for answers sent from the shared links. */
var SHARED_CODE = '(shared link)';

/* ------------------------------------------------------------------ */
/* Spreadsheet menu                                                    */
/* ------------------------------------------------------------------ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Invitation')
    .addItem('1. Set up sheets', 'setupSheets')
    .addItem('2. Set website address', 'promptSiteUrl')
    .addItem('3. Generate codes & links', 'generateCodesAndLinks')
    .addSeparator()
    .addItem('Show website secret', 'showSecret')
    .addToUi();
}

function setupSheets() {
  var ss = SpreadsheetApp.getActive();
  var guests = ensureSheet_(ss, SHEETS.guests, GUEST_HEADERS);
  ensureSheet_(ss, SHEETS.responses, RESPONSE_HEADERS);
  ensureSheet_(ss, SHEETS.log, LOG_HEADERS);
  buildSummary_(ss);

  guests.getRange('C2:C').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Guest', 'Godparent'], true).setAllowInvalid(false).build()
  );
  guests.getRange('D2:D').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Ninong', 'Ninang'], true).setAllowInvalid(false).build()
  );
  guests.getRange('E2:E').setDataValidation(
    SpreadsheetApp.newDataValidation().requireNumberBetween(1, MAX_GUESTS_CEILING).setAllowInvalid(false)
      .setHelpText('Total seats for this invitation, including the invitee (1–' + MAX_GUESTS_CEILING + ').').build()
  );

  ensureSecret_();
  SpreadsheetApp.getUi().alert(
    'Sheets are ready.\n\nNext: add your guests to the "Guests" tab, then run\n' +
    'Invitation → 2. Set website address, and Invitation → 3. Generate codes & links.'
  );
}

function promptSiteUrl() {
  var ui = SpreadsheetApp.getUi();
  var current = PropertiesService.getScriptProperties().getProperty('SITE_URL') || '';
  var res = ui.prompt(
    'Website address',
    'Paste your invitation website address, e.g. https://your-site.vercel.app' +
      (current ? '\n\nCurrent: ' + current : ''),
    ui.ButtonSet.OK_CANCEL
  );
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var url = res.getResponseText().trim().replace(/\/+$/, '');
  if (!/^https?:\/\/[^\s]+$/.test(url)) {
    ui.alert('That does not look like a web address. Nothing was changed.');
    return;
  }
  PropertiesService.getScriptProperties().setProperty('SITE_URL', url);
  ui.alert('Saved. Run "Generate codes & links" to refresh the Invitation Link column.');
}

function generateCodesAndLinks() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEETS.guests);
  if (!sheet) throw new Error('Run "Set up sheets" first.');
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('Add guests to the "Guests" tab first.');
    return;
  }

  var range = sheet.getRange(2, 1, lastRow - 1, GUEST_HEADERS.length);
  var rows = range.getValues();
  var siteUrl = PropertiesService.getScriptProperties().getProperty('SITE_URL') || '';
  var used = {};
  rows.forEach(function (r) {
    var c = String(r[G.code]).trim().toUpperCase();
    if (c) used[c] = true;
  });

  var created = 0;
  rows.forEach(function (r) {
    if (!String(r[G.name]).trim()) return;
    var code = String(r[G.code]).trim().toUpperCase();
    if (!code) {
      do { code = randomCode_(); } while (used[code]);
      used[code] = true;
      created++;
    }
    r[G.code] = code;
    if (!r[G.type]) r[G.type] = 'Guest';
    if (!r[G.max]) r[G.max] = 1;
    r[G.link] = siteUrl ? siteUrl + '/i/' + code : '(set website address first)';
  });

  range.setValues(rows);
  SpreadsheetApp.getUi().alert(created + ' new code(s) created. Links are in the "Invitation Link" column.');
}

function showSecret() {
  SpreadsheetApp.getUi().alert(
    'Website secret',
    'Paste this into Vercel as APPS_SCRIPT_SECRET (and into .env.local for local testing):\n\n' + ensureSecret_(),
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/* ------------------------------------------------------------------ */
/* Web app endpoints                                                   */
/* ------------------------------------------------------------------ */

/** Visiting the /exec URL in a browser confirms the deployment works. Reveals no data. */
function doGet() {
  return json_({ ok: true, status: 'RSVP service is running.' });
}

function doPost(e) {
  var req;
  try {
    req = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_request' });
  }

  var secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
  if (!secret || req.secret !== secret) return json_({ ok: false, error: 'unauthorized' });

  // Shared links: the guest typed their name instead of using a personal code.
  if (!req.code && typeof req.name === 'string') {
    var name = clean_(req.name, MAX_NAME);
    if (!name) return json_({ ok: false, error: 'bad_request' });
    var type = req.action === 'godparent' || req.guestType === 'godparent' ? 'Godparent' : 'Guest';
    var sharedLock = LockService.getScriptLock();
    sharedLock.waitLock(20000);
    try {
      if (req.action === 'rsvp') return json_(saveSharedRsvp_(name, type, req));
      if (req.action === 'godparent') return json_(saveSharedGodparent_(name, req));
      return json_({ ok: false, error: 'bad_request' });
    } finally {
      sharedLock.releaseLock();
    }
  }

  var code = String(req.code || '').trim().toUpperCase();
  if (!/^[A-Z0-9]{6,12}$/.test(code)) return json_({ ok: false, error: 'not_found' });

  if (req.action === 'lookup') {
    var guest = findGuest_(code);
    if (!guest) return json_({ ok: false, error: 'not_found' });
    var resp = findResponse_(code);
    return json_({ ok: true, invite: toInvite_(guest.values, resp ? resp.values : null) });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (req.action === 'rsvp') return json_(saveRsvp_(code, req));
    if (req.action === 'godparent') return json_(saveGodparent_(code, req));
    return json_({ ok: false, error: 'bad_request' });
  } finally {
    lock.releaseLock();
  }
}

/* ------------------------------------------------------------------ */
/* Writes                                                              */
/* ------------------------------------------------------------------ */

/** Validates an RSVP against `max` and returns a function that writes it into a Responses row. */
function rsvpWriter_(req, max) {
  var attending = req.attending === true;
  var count = attending ? parseInt(req.guestCount, 10) : 0;
  if (attending && (!(count >= 1) || count > max)) return null;

  var companions = [];
  if (attending && Array.isArray(req.companions)) {
    companions = req.companions
      .map(function (n) { return clean_(n, MAX_COMPANION); })
      .filter(function (n) { return n; })
      .slice(0, count - 1);
  }
  var message = clean_(req.message, MAX_MESSAGE);
  return {
    summary: (attending ? 'Yes, ' + count : 'No') + (message ? ' — ' + message : ''),
    apply: function (r) {
      r[R.attending] = attending ? 'Yes' : 'No';
      r[R.count] = count;
      r[R.companions] = companions.join('; ');
      r[R.message] = message;
      r[R.rsvpAt] = new Date();
    }
  };
}

function godparentWriter_(req) {
  if (typeof req.accepted !== 'boolean') return null;
  var message = clean_(req.message, MAX_MESSAGE);
  return {
    summary: (req.accepted ? 'Accepted' : 'Declined') + (message ? ' — ' + message : ''),
    apply: function (r) {
      r[R.gpAnswer] = req.accepted ? 'Accepted' : 'Declined';
      r[R.gpMessage] = message;
      r[R.gpAt] = new Date();
    }
  };
}

function saveRsvp_(code, req) {
  var guest = findGuest_(code);
  if (!guest) return { ok: false, error: 'not_found' };
  var w = rsvpWriter_(req, maxGuests_(guest.values));
  if (!w) return { ok: false, error: 'over_limit' };

  var row = upsertResponse_(code, guest.values, w.apply);
  log_(code, 'rsvp', w.summary);
  return { ok: true, invite: toInvite_(guest.values, row) };
}

function saveGodparent_(code, req) {
  var guest = findGuest_(code);
  if (!guest) return { ok: false, error: 'not_found' };
  if (inviteType_(guest.values) !== 'godparent') return { ok: false, error: 'not_godparent' };
  var w = godparentWriter_(req);
  if (!w) return { ok: false, error: 'bad_request' };

  var row = upsertResponse_(code, guest.values, w.apply);
  log_(code, 'godparent', w.summary);
  return { ok: true, invite: toInvite_(guest.values, row) };
}

/** RSVP from a shared link. One row per name and invitation type. */
function saveSharedRsvp_(name, type, req) {
  var w = rsvpWriter_(req, MAX_GUESTS_CEILING);
  if (!w) return { ok: false, error: 'over_limit' };
  var row = writeResponseRow_(findSharedResponse_(name, type), SHARED_CODE, name, type, w.apply);
  log_(SHARED_CODE, 'rsvp · ' + name, w.summary);
  return { ok: true, invite: sharedInvite_(row) };
}

/** Ninong/Ninang answer from the shared godparent link. */
function saveSharedGodparent_(name, req) {
  var w = godparentWriter_(req);
  if (!w) return { ok: false, error: 'bad_request' };
  var row = writeResponseRow_(findSharedResponse_(name, 'Godparent'), SHARED_CODE, name, 'Godparent', w.apply);
  log_(SHARED_CODE, 'godparent · ' + name, w.summary);
  return { ok: true, invite: sharedInvite_(row) };
}

/** One row per code: updates the existing row or appends a new one. */
function upsertResponse_(code, guestValues, mutate) {
  var type = inviteType_(guestValues) === 'godparent' ? 'Godparent' : 'Guest';
  return writeResponseRow_(findResponse_(code), code, String(guestValues[G.name]).trim(), type, mutate);
}

function writeResponseRow_(existing, code, name, type, mutate) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEETS.responses);
  var row = existing ? existing.values.slice() : new Array(RESPONSE_HEADERS.length).fill('');

  row[R.code] = code;
  row[R.name] = name;
  row[R.type] = type;
  mutate(row);
  row[R.submissions] = (parseInt(row[R.submissions], 10) || 0) + 1;

  // Prevent anything typed by a guest from being interpreted as a formula.
  // The escaped copy goes to the Sheet; the original is returned to the website.
  var written = row.slice();
  written[R.name] = safe_(row[R.name]);
  written[R.companions] = safe_(row[R.companions]);
  written[R.message] = safe_(row[R.message]);
  written[R.gpMessage] = safe_(row[R.gpMessage]);

  if (existing) {
    sheet.getRange(existing.row, 1, 1, written.length).setValues([written]);
  } else {
    sheet.appendRow(written);
  }
  return row;
}

function log_(code, action, details) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEETS.log);
  if (sheet) sheet.appendRow([new Date(), code, action, safe_(details)]);
}

/* ------------------------------------------------------------------ */
/* Reads                                                               */
/* ------------------------------------------------------------------ */

function findGuest_(code) {
  return findRow_(SHEETS.guests, GUEST_HEADERS.length, code);
}

function findResponse_(code) {
  return findRow_(SHEETS.responses, RESPONSE_HEADERS.length, code);
}

/** Shared-link answers are matched by name (ignoring case and extra spaces) and type. */
function findSharedResponse_(name, type) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEETS.responses);
  if (!sheet || sheet.getLastRow() < 2) return null;
  var key = nameKey_(name);
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, RESPONSE_HEADERS.length).getValues();
  for (var i = 0; i < values.length; i++) {
    var v = values[i];
    if (String(v[R.code]).trim() === SHARED_CODE && String(v[R.type]) === type && nameKey_(unsafe_(v[R.name])) === key) {
      return { row: i + 2, values: v };
    }
  }
  return null;
}

function findRow_(sheetName, width, code) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return null;
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, width).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim().toUpperCase() === code) return { row: i + 2, values: values[i] };
  }
  return null;
}

function toInvite_(g, r) {
  var role = String(g[G.role]).trim().toLowerCase();
  return withAnswers_({
    code: String(g[G.code]).trim().toUpperCase(),
    name: String(g[G.name]).trim(),
    type: inviteType_(g),
    role: role === 'ninong' ? 'Ninong' : role === 'ninang' ? 'Ninang' : '',
    maxGuests: maxGuests_(g),
    rsvp: null,
    godparent: null
  }, r);
}

function sharedInvite_(r) {
  return withAnswers_({
    code: '',
    name: String(r[R.name]),
    type: r[R.type] === 'Godparent' ? 'godparent' : 'guest',
    role: '',
    maxGuests: MAX_GUESTS_CEILING,
    rsvp: null,
    godparent: null
  }, r);
}

/** Copies the RSVP and godparent answers from a Responses row onto an invite object. */
function withAnswers_(invite, r) {
  if (r && (r[R.attending] === 'Yes' || r[R.attending] === 'No')) {
    invite.rsvp = {
      attending: r[R.attending] === 'Yes',
      guestCount: parseInt(r[R.count], 10) || 0,
      companions: String(r[R.companions] || '').split(';').map(function (s) { return s.trim(); }).filter(String),
      message: String(r[R.message] || ''),
      updatedAt: iso_(r[R.rsvpAt])
    };
  }
  if (r && (r[R.gpAnswer] === 'Accepted' || r[R.gpAnswer] === 'Declined')) {
    invite.godparent = {
      accepted: r[R.gpAnswer] === 'Accepted',
      message: String(r[R.gpMessage] || ''),
      updatedAt: iso_(r[R.gpAt])
    };
  }
  return invite;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function inviteType_(g) {
  return String(g[G.type]).trim().toLowerCase() === 'godparent' ? 'godparent' : 'guest';
}

function maxGuests_(g) {
  var n = parseInt(g[G.max], 10);
  if (!(n >= 1)) return 1;
  return Math.min(n, MAX_GUESTS_CEILING);
}

function clean_(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function nameKey_(name) {
  return String(name || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Reverses safe_() so stored names can be compared with typed ones. */
function unsafe_(value) {
  var s = String(value == null ? '' : value);
  return /^'[=+\-@]/.test(s) ? s.slice(1) : s;
}

function safe_(value) {
  var s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function iso_(value) {
  return value instanceof Date ? value.toISOString() : String(value || '');
}

function randomCode_() {
  var out = '';
  for (var i = 0; i < CODE_LENGTH; i++) out += CODE_ALPHABET.charAt(Math.floor(Math.random() * CODE_ALPHABET.length));
  return out;
}

function ensureSecret_() {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('SHARED_SECRET');
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('SHARED_SECRET', secret);
  }
  return secret;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function ensureSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  var first = sheet.getRange(1, 1, 1, headers.length);
  if (!String(first.getValues()[0][0]).trim()) first.setValues([headers]);
  first.setFontWeight('bold').setBackground('#F3D3D0');
  sheet.setFrozenRows(1);
  return sheet;
}

function buildSummary_(ss) {
  var sheet = ss.getSheetByName(SHEETS.summary) || ss.insertSheet(SHEETS.summary, 0);
  sheet.clear();

  var rows = [
    ['Christening RSVP Summary', ''],
    ['', ''],
    ['Personal invitations', '=COUNTA(Guests!B2:B)'],                                // B3
    ['Seats reserved', '=SUM(Guests!E2:E)'],                                         // B4
    ['RSVPs received (all links)', '=COUNTIF(Responses!D2:D,"Yes")+COUNTIF(Responses!D2:D,"No")'], // B5
    ['Attending (responses)', '=COUNTIF(Responses!D2:D,"Yes")'],                     // B6
    ['Declined', '=COUNTIF(Responses!D2:D,"No")'],                                   // B7
    ['Pending (personal links)', '=MAX(0,B3-COUNTIFS(Responses!A2:A,"<>' + SHARED_CODE + '",Responses!D2:D,"<>"))'], // B8
    ['Expected attendees (people)', '=SUMIF(Responses!D2:D,"Yes",Responses!E2:E)'],  // B9
    ['', ''],
    ['Godparents invited', '=COUNTIF(Guests!C2:C,"Godparent")'],                     // B11
    ['Godparents accepted', '=COUNTIF(Responses!I2:I,"Accepted")'],                  // B12
    ['Godparents declined', '=COUNTIF(Responses!I2:I,"Declined")'],                  // B13
    ['Godparents yet to answer (personal links)', '=MAX(0,B11-COUNTIFS(Responses!A2:A,"<>' + SHARED_CODE + '",Responses!I2:I,"<>"))'], // B14
    ['', ''],
    ['Still waiting on (no RSVP yet)', '']
  ];
  sheet.getRange(1, 1, rows.length, 2).setValues(rows);
  sheet.getRange(rows.length + 1, 1).setFormula(
    '=IFERROR(FILTER(Guests!B2:B, Guests!B2:B<>"", ' +
      'ISNA(MATCH(Guests!A2:A, FILTER(Responses!A2:A, Responses!D2:D<>""), 0))), "Everyone has responded")'
  );

  sheet.getRange('A1').setFontSize(14).setFontWeight('bold');
  sheet.getRange('A3:A16').setFontWeight('bold');
  sheet.setColumnWidth(1, 260);
  sheet.setColumnWidth(2, 120);
}
