# Setup guide — Google Sheets RSVP, Google Forms fallback, and Vercel

This guide covers everything you do by hand in Google and Vercel. Nothing here has been created for you yet.

```
Guest opens https://your-site.vercel.app/i/K7M2QX9P
        │
        ▼
Vercel (Next.js server) ── secret ──► Google Apps Script web app ──► Google Sheet
        │                                   (looks up ONE code,          Guests / Responses /
        ▼                                    enforces Max Guests)        Log / Summary
Invitation page with the guest's name, seat count and their own previous answer
```

* **Part A** — Google Sheet + Apps Script. This is the main RSVP system and the recommended setup.
* **Part B** — Connect the website (Vercel environment variables).
* **Part C** — Google Forms. This is an optional backup, used only if Part A isn't configured or can't be reached.
* **Part D** — Testing checklist.
* **Part E** — Day-to-day use.
* **Part F** — Limitations and privacy. Please read this part.

> **Account types.** Steps marked **(account-dependent)** behave differently on a personal Gmail account
> than on a Google Workspace (work or school) account whose administrator restricts sharing. A personal
> Gmail account supports everything here.

---

## Part A — Google Sheet + Apps Script

### A1. Create the spreadsheet

1. Go to <https://sheets.google.com> and click **Blank spreadsheet**.
2. Name it, for example **Christening RSVP**.

### A2. Add the script

1. In the spreadsheet, click **Extensions → Apps Script**. A new tab opens.
2. Delete everything in `Code.gs`.
3. Open [`apps-script/Code.gs`](../apps-script/Code.gs) from this project, copy all of it, and paste it in.
4. Click the **Save** icon (or press Ctrl+S).
5. Go back to the spreadsheet tab and **reload the page**. After a few seconds an **Invitation** menu appears
   next to **Help**.

### A3. Create the sheets

1. Click **Invitation → 1. Set up sheets**.
2. The first time, Google asks for authorization:
   * Click **Continue**, then choose your account.
   * You may see **"Google hasn't verified this app."** This is normal for a script you wrote yourself.
     Click **Advanced → Go to (your project name) (unsafe) → Allow**.
3. This creates four tabs:

| Tab | What it's for |
| --- | --- |
| **Guests** | Your master guest list. You fill this in. It is private and never sent to the website as a list. |
| **Responses** | One row per invitation. A resubmission **updates** that row, so it is never counted twice. |
| **Log** | Every submission, including changes, for history. |
| **Summary** | Live totals: attending, declined, pending, expected head-count, and godparent answers. |

### A4. Fill in the **Guests** tab (one row per invitation)

| Column | What to enter |
| --- | --- |
| **Code** | Leave blank. Step A6 generates it. |
| **Name** | Write the name as you want it shown, e.g. `Tita Maria`, `The Reyes Family`, `Kuya Ben`. |
| **Type** | `Guest` or `Godparent` (dropdown). |
| **Role** | Godparents only: `Ninong` or `Ninang`. |
| **Max Guests** | Total seats for this invitation, **including the invitee** (1–20). |
| **Contact (private)** | Optional phone or e-mail. Only you see this. The website never reads it. |
| **Notes** | Anything you like. |
| **Invitation Link** | Leave blank. Step A6 fills it in. |

### A5. Deploy the script as a web app

1. In the Apps Script tab, click **Deploy → New deployment**.
2. Click the gear icon next to **Select type**, then choose **Web app**.
3. Fill in:
   * **Description:** `RSVP v1`
   * **Execute as:** **Me**
   * **Who has access:** **Anyone** **(account-dependent)**
4. Click **Deploy**, then **Authorize access** if asked.
5. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy…/exec`.
   This is your `APPS_SCRIPT_URL`.
6. Paste that URL into a browser. You should see `{"ok":true,"status":"RSVP service is running."}`.

> **(account-dependent)** On some Google Workspace accounts the administrator hides **Anyone** and only
> allows **Anyone within *your organization***. That setting will **not** work, because the website calls
> the script without signing in. Use a personal Gmail account for the spreadsheet and script, or rely on the
> Google Forms backup (Part C).
>
> "Anyone" only means the URL can be called. The script refuses every request that lacks your secret
> (step A7), and it only ever returns the single invitation that matches a valid code.

**After editing the script later**, click **Deploy → Manage deployments → pencil icon → Version: New version →
Deploy**. The URL stays the same. Saving the script alone does **not** update the live web app.

### A6. Generate the invitation codes and links

1. Deploy the website first (Part B) so you know its address, e.g. `https://christening-baby.vercel.app`.
2. Click **Invitation → 2. Set website address** and paste that address.
3. Click **Invitation → 3. Generate codes & links**.
   * Each guest gets an 8-character code such as `K7M2QX9P`. Look-alike characters (0/O, 1/I/L) are never used.
   * The **Invitation Link** column fills with each guest's personal link, e.g.
     `https://christening-baby.vercel.app/i/K7M2QX9P`.
4. Re-run step 3 any time you add guests. Existing codes are never changed.

Send each guest **their own** link by Messenger, Viber, SMS or e-mail.

### A7. Get the website secret

Click **Invitation → Show website secret** and copy the long value. This is your `APPS_SCRIPT_SECRET`.
Treat it like a password: never post it, and only paste it into Vercel and `.env.local`.

---

## Part B — Connect the website (Vercel)

All RSVP settings live in **environment variables**, read in one place: [`src/config/rsvp.ts`](../src/config/rsvp.ts).
You never need to edit code to connect Google.

1. In Vercel, open your project and go to **Settings → Environment Variables**.
2. Add the following. Use **Production** and **Preview**, and keep the names exactly as shown.
   None of them may start with `NEXT_PUBLIC_`.

| Name | Value | Required? |
| --- | --- | --- |
| `APPS_SCRIPT_URL` | Web app URL from A5 (ends in `/exec`) | Yes, for custom RSVP |
| `APPS_SCRIPT_SECRET` | Secret from A7 | Yes, for custom RSVP |
| `GOOGLE_FORM_GUEST_URL` | Guest form link (Part C) | Optional backup |
| `GOOGLE_FORM_GODPARENT_URL` | Godparent form link (Part C) | Optional backup |
| `GOOGLE_FORM_GODPARENT_ATTENDANCE_URL` | Only if godparents RSVP on a *third* form | Optional |
| `GOOGLE_FORM_GUEST_NAME_ENTRY` | e.g. `entry.1234567890` (Part C5) | Optional |
| `GOOGLE_FORM_GODPARENT_NAME_ENTRY` | e.g. `entry.987654321` | Optional |
| `SITE_URL` | `https://your-site.vercel.app` (for link previews) | Optional |

3. Go to **Deployments → ⋯ → Redeploy**. Environment variables only take effect on a new deployment.

**Local testing:** copy [`.env.example`](../.env.example) to `.env.local`, fill in the same values, and run
`npm run dev`. `.env.local` is git-ignored.

**What the site does with these:**

| Configured | RSVP behaviour |
| --- | --- |
| `APPS_SCRIPT_URL` + `APPS_SCRIPT_SECRET` | Custom RSVP form saves straight to the Sheet, with guest limits enforced. |
| Only Google Form URLs | "Confirm My Attendance" opens the Google Form in a new tab. |
| Both | Custom RSVP. If the Sheet can't be reached, the page falls back to the Form links. |
| Neither | The page shows "RSVP opens soon". |

---

## Part C — Google Forms (optional backup)

You only need this if you want a backup for when Apps Script is unavailable, or if your account can't use
"Anyone" access (A5). With Forms, the response is completed **on Google's page**. The website never sees it
and never claims it was saved.

### C1. One form or two?

**Recommended: two separate forms**, one for **Guests** and one for **Godparents**. Each stays short. Each
responses sheet has fixed columns, which makes formulas simpler. The website already sends each group to its
own form.

One form with branching also works (see C3). You'd use a first question such as "Which invitation did you
receive?" and jump to the right section.

### C2. Create the forms

Go to <https://forms.google.com> and click **Blank form**.

**Guest form — "Christening RSVP"**

| # | Question | Type | Required |
| --- | --- | --- | --- |
| 1 | Your full name | Short answer | ✔ |
| 2 | Will you attend? | Multiple choice: `Joyfully attending` / `Unable to attend` | ✔ |
| 3 | Number of attendees, including you | Dropdown: `1`, `2`, `3`, `4`, `5` | ✔ (in section 2) |
| 4 | Names of your companions | Paragraph | — (section 2) |
| 5 | A message for the family | Paragraph | — |

**Godparent form — "Ninong / Ninang Response"**

| # | Question | Type | Required |
| --- | --- | --- | --- |
| 1 | Your full name | Short answer | ✔ |
| 2 | Will you accept the role of Ninong/Ninang? | Multiple choice: `Yes, I'd be honored` / `I'm sorry, I can't` | ✔ |
| 3 | Will you attend the christening? | Multiple choice: `Yes` / `No` | ✔ |
| 4 | Number of attendees, including you | Dropdown: `1`, `2`, `3` | ✔ (in section 2) |
| 5 | A message for the family | Paragraph | — |

Add a description line to the godparent form: *"Accepting the role does not confirm attendance. Please answer both questions."*

### C3. Sections and branching

Branching lets you skip the head-count questions for anyone who can't attend.

1. Click the question **after** "Will you attend?". In the right-hand toolbar, click **Add section**
   (the icon with two rectangles). Move the head-count and companion questions into this new **Section 2**.
2. Below Section 2, add **Section 3** with the message question.
3. Click the "Will you attend?" question, then **⋮ (bottom-right) → Go to section based on answer**.
4. Set:
   * `Joyfully attending` (or `Yes`) → **Continue to section 2**
   * `Unable to attend` (or `No`) → **Go to section 3**
5. At the bottom of Section 2, set **After section 2 → Continue to section 3**.
6. Click **Preview** (eye icon) and try both answers.

### C4. Form settings

Go to the **Settings** tab.

* **Responses → Collect email addresses:** **Do not collect**, unless you want e-mails. *Verified* requires
  guests to sign in.
* **Responses → Limit to 1 response:** **Off**. Turning it on forces every guest to sign in with a Google
  account, which many relatives won't have.
* **Responses → Allow response editing:** your choice. If it's on, guests can edit later, which reduces duplicates.
* **(account-dependent)** On a Workspace account, also check **Responses → Restrict to users in
  [your organization] and its trusted organizations**, and switch it **Off**. Otherwise external guests are
  asked to sign in. Some administrators lock this setting. A personal Gmail account doesn't have it.
* **Presentation → Confirmation message:** e.g. *"Thank you! Your RSVP has been recorded. You may close this tab."*

### C5. Link to Sheets, and copy the URLs

1. **Link responses:** in the form's **Responses** tab, click **Link to Sheets**. Choose **Select existing
   spreadsheet**, then pick **Christening RSVP**. This adds a tab called `Form Responses 1` (or similar).
   Do the same for the second form; it becomes `Form Responses 2`.
2. **Responder URL:** click **Send**, then the **link icon**. **Untick "Shorten URL"**, because short
   `forms.gle` links can't be prefilled. Click **Copy**. The link looks like
   `https://docs.google.com/forms/d/e/1FAIpQ…/viewform`. Paste it into Vercel as `GOOGLE_FORM_GUEST_URL`
   or `GOOGLE_FORM_GODPARENT_URL`.
3. **Prefilled name (optional):**
   * Click **⋮ (top-right) → Get pre-filled link**.
   * Type `NAME` in "Your full name", then click **Get link → Copy link**.
   * Paste it somewhere and find the part like `entry.1234567890=NAME`.
   * Put `entry.1234567890` into `GOOGLE_FORM_GUEST_NAME_ENTRY` (or `…_GODPARENT_NAME_ENTRY`).
   * The website fills in the guest's name automatically. Don't paste the whole prefilled link as the form URL.

### C6. Organize Form responses (formulas)

Form responses are **one row per submission**, so the same guest can appear twice. To count each person
once, keep only their latest answer. Add a tab named **Guest Latest**. In cell A1, put:

```
=QUERY(SORTN(SORT('Form Responses 1'!A2:F, 1, FALSE), 9^9, 2, 2, TRUE), "select * where Col2 is not null", 0)
```

This sorts newest first, then keeps the first row per name (column B). Names are matched exactly, so
"Maria Santos" and "maria santos " count as different people. Glance at the list occasionally.

On a **Form Summary** tab, assuming the Form columns A Timestamp, B Name, C Attend, D Count, E Companions,
F Message. The "Pending" row compares against your master list in a tab named **Guests**, with names in
column B. Step A3 creates that tab; if you're using Forms only, make it by hand and type names exactly as
guests will.

| Metric | Formula |
| --- | --- |
| Total responses (people, deduplicated) | `=COUNTA('Guest Latest'!B:B)` |
| Confirmed attending | `=COUNTIF('Guest Latest'!C:C, "Joyfully attending")` |
| Declined | `=COUNTIF('Guest Latest'!C:C, "Unable to attend")` |
| Total expected attendees | `=SUMIF('Guest Latest'!C:C, "Joyfully attending", 'Guest Latest'!D:D)` |
| Pending (vs. master list in `Guests!B`) | `=COUNTA(Guests!B2:B) - SUMPRODUCT((Guests!B2:B<>"") * (COUNTIF('Guest Latest'!B:B, Guests!B2:B)>0))` |
| Accepted Ninong/Ninang | Do the same latest-answer step for `Form Responses 2` in a **Godparent Latest** tab, then `=COUNTIF('Godparent Latest'!C:C, "Yes, I'd be honored")` |

**Pivot table (optional):** select the **Guest Latest** data and click **Insert → Pivot table**.
Rows = *Will you attend?*, Values = *Number of attendees* (SUM) and *Your full name* (COUNTA).

---

## Part D — Testing checklist

Do this before sending real invitations. Use a test row in **Guests**, e.g. `Test Guest`, Max Guests `2`.

1. **Script alive:** open the `/exec` URL in a browser. You should see `"RSVP service is running."`
2. **Personal page:** open the test guest's link. The envelope should say *For Test Guest*, and the RSVP card
   should say *We have reserved 2 seats*.
3. **Submit:** choose *Joyfully attending*, pick 2, add a companion, and press **Confirm My Attendance**.
   You should see *"Thank you, Test Guest! Your RSVP has been saved."* This message only appears after the
   Sheet confirms the write.
4. **Sheet:** **Responses** has one row with `Yes`, `2`. **Log** has one row. **Summary** shows 1 attending
   and 2 expected attendees.
5. **No duplicates:** reload the link. It says *Hello again*. Click **Update my response**, switch to
   *Unable to attend*, and send. **Responses** still has **one** row (now `No`, Submissions `2`). **Log** has two rows.
6. **Godparent:** repeat with a `Godparent` / `Ninang` test row. Answer the role, then RSVP separately. Both
   appear on the same Responses row (Attending and Godparent Answer columns).
7. **Bad link:** open `/i/WRONG123`. You should see *"We couldn't find this invitation."*
8. **Forms backup (if configured):** temporarily remove `APPS_SCRIPT_URL` in Vercel and redeploy. Open
   `/?to=Test%20Guest` and press **Confirm My Attendance**. The Google Form should open in a new tab with the
   name filled in. Submit it, then check `Form Responses 1`. Put the variable back and redeploy.
9. **Mobile:** on an iPhone and an Android phone, open a personal link from Messenger or Viber and check the
   whole flow. In-app browsers work, and Form links open in the phone's browser. Also check the page in
   landscape.
10. **Clean up:** delete the test rows from **Guests**, **Responses** and **Log**.

---

## Part E — Day-to-day use

* **Head-count:** read the **Summary** tab. *Still waiting on* lists everyone without an RSVP.
* **Change someone's seats:** edit **Max Guests** in **Guests**. It applies the next time they open their link.
* **Clear an answer so a guest can start fresh:** delete their row in **Responses**.
* **Cancel an invitation link:** delete or change the guest's **Code**. The old link stops working.
* **Change wording, date, venues, photos:** edit [`src/config/event.ts`](../src/config/event.ts) and
  redeploy. Photos live in `public/images/`.
* **RSVP deadline:** `rsvpDeadline` in `src/config/event.ts`. After it passes, the site shows "RSVPs are now
  closed" and the server refuses new submissions.

---

## Part F — Limitations and privacy

**What the website can and can't see**

* The guest list is never sent to browsers. A personal page receives only that invitation's name, type,
  seat count and that guest's own previous answer. The private **Contact** and **Notes** columns are never
  read by the website.
* `APPS_SCRIPT_SECRET` and the script URL are used only on the Vercel server. They are not in any public
  JavaScript bundle.
* Search engines are asked not to index the site (`noindex`).

**Personal links are "bearer" links**

* Anyone who has a guest's link can view that invitation and answer for it. The 8-character code is hard
  to guess (about 850 billion combinations), but a forwarded link works for whoever receives it. Don't post
  personal links publicly. Use the main page (`/`) for anything public.
* There is no sign-in, by design, so relatives don't need accounts.

**Guest limits and duplicates**

* **Custom RSVP (Part A):** the limit is enforced by the script against **Max Guests** in the Sheet, so
  extra seats are refused even if someone tampers with the page. Duplicates are prevented because each code
  has exactly one Responses row; resubmitting updates it.
* **Google Forms (Part C):** limits can't be enforced per invitation. A Form dropdown has the same choices
  for everyone, and guests can edit prefilled values. Duplicate submissions also can't be prevented without
  forcing Google sign-in. Use the latest-answer formulas in C6 and compare head-counts with your master list by hand.

**Prefilled and query-string values are conveniences only**

* `/?to=Tita%20Maria&type=godparent&role=ninang` only changes the greeting text, and a prefilled Form name
  only saves typing. Anyone can edit either one, so neither proves who responded.

**Google service limits**

* Free Apps Script accounts have daily quotas and a limit on simultaneous runs. These are far above what an
  invitation needs, but if hundreds of guests submit in the same minute, a few might be asked to try again.
  The site shows a friendly error and a Form backup link if configured.
* The first request after a quiet period can take 1–3 seconds while Google wakes the script. The site shows
  "Preparing your invitation…" meanwhile.
