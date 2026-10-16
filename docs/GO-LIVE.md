# Going live — step by step (no experience needed)

This guide takes Zane's invitation from your computer to a real link you can send by Messenger or Viber.
Plan for about **1 hour** the first time. Do the steps in order.

> **Good news: you don't need Google Forms.** Guests answer on the invitation itself, and their answers
> go straight into a Google **Sheet**, which works like Excel. You'll paste one ready-made script into that
> Sheet. You won't write any code. Google Forms is only an optional backup (see `docs/SETUP.md`, Part C).

**What you need**

* A **personal Gmail account**. A work or school Google account may block a setting we need (Step 3e).
* Your computer with this project open in VS Code.
* About 10 minutes to create a free **Vercel** account. Vercel is the service that hosts the website.

---

## Step 1 — Finish the remaining details (10 min)

Open `src/config/event.ts` in VS Code and change these. They are marked `TODO`.

| What | Line to find | Example |
| --- | --- | --- |
| Parents' names (closing signature) | `parents: "Mommy & Daddy"` | `parents: "Juan & Maria"` |
| Ninongs and Ninangs | `ninongs: [...]`, `ninangs: [...]` | `ninangs: ["Tita Maria Santos", "Ate Joy Cruz"]` |
| Diaper size | `detail: "Size: to follow"` | `detail: "Size: Medium (M)"` |
| RSVP deadline | `rsvpDeadline: "2026-11-22T23:59:59+08:00"` | Change only the date part |
| Hashtag | `hashtag: ...` | Or `hashtag: ""` to hide it |

Keep the quote marks `"` and commas `,` exactly as they are. Only change the words inside the quotes.

**Optional extras** (same file):

| What | How |
| --- | --- |
| Letter from the parents | Edit the two paragraphs in `parentsMessage`. |
| Background music | Copy an MP3 you have the rights to use into a new folder `public/music`, e.g. `public/music/lullaby.mp3`, then set `music: { src: "/music/lullaby.mp3", title: "Song title", artist: "Singer" }`. It starts when the guest taps the envelope. Leave `src: ""` to hide the player. |
| GCash or bank QR codes | Save the QR image in `public/images`, e.g. `gcash-qr.png`, then set `qrCodes: [{ label: "GCash", src: "/images/gcash-qr.png" }]`. |
| Real photos of the venues | Save them in `public/images`, then set `image: "/images/church.jpg"` under `ceremony` and/or `reception`. Without a photo, a drawn illustration is shown. |
| Health reminders | Edit or remove items under `protocol`. |

**Preview your changes.** In VS Code click **Terminal → New Terminal**, type the line below and press Enter:

```
npm run dev
```

Open <http://localhost:3000> in your browser. Changes appear as soon as you save the file.
To preview a godparent invitation, open <http://localhost:3000/?to=Tita%20Maria&type=godparent&role=ninang>.
Press **Ctrl + C** in the terminal to stop the preview.

---

## Step 2 — Put the website online (15 min)

1. Go to <https://vercel.com/signup>, choose the **Hobby** (free) plan, and sign up with **Continue with
   Google** or your e-mail.
2. In the VS Code terminal, run:

   ```
   npx vercel login
   ```

   Pick the same sign-in method. A browser tab opens; approve it, then come back to VS Code.
3. Run:

   ```
   npx vercel
   ```

   Answer the questions like this. Use the arrow keys and Enter.
   * *Set up and deploy?* → **Yes**
   * *Which scope?* → your name
   * *Link to existing project?* → **No**
   * *Project name?* → type `zane-christening`. This name becomes your web address.
   * *In which directory is your code located?* → just press **Enter**
   * *Want to modify these settings?* → **No**
4. Wait for it to finish (1–3 minutes). Then publish the real version:

   ```
   npx vercel --prod
   ```

   At the end it prints your live address, for example **https://zane-christening.vercel.app**.
   Open it on your phone. The invitation should work. The RSVP will say "RSVP opens soon" until Step 4.

> If `zane-christening` is already taken, Vercel adds extra letters to the address. You can see and change
> the address later in Vercel → your project → **Settings → Domains**.

---

## Step 3 — Create the guest list Sheet (20 min)

### 3a. Make the spreadsheet

1. Go to <https://sheets.google.com> and sign in with your **personal Gmail**.
2. Click the big **+ Blank spreadsheet**.
3. Click **Untitled spreadsheet** (top-left) and rename it **Zane Christening RSVP**.

### 3b. Paste the script

1. In the Sheet's top menu, click **Extensions → Apps Script**. A new tab opens with a code editor.
2. In VS Code, open the file `apps-script/Code.gs`, press **Ctrl + A** (select all), then **Ctrl + C** (copy).
3. In the Apps Script tab, click inside the editor, press **Ctrl + A**, then **Ctrl + V** to replace
   everything with what you copied.
4. Click the **💾 Save** icon (or press **Ctrl + S**).
5. Optional: click **Untitled project** at the top and rename it to **RSVP**.

### 3c. Create the tabs

1. Go back to the **Sheet** tab and **refresh the page** (F5).
2. Wait about 5 seconds. A new menu called **Invitation** appears at the top, after **Help**.
3. Click **Invitation → 1. Set up sheets**.
4. Google asks for permission. This is normal for your own script:
   * Click **Continue** (or **OK**), then pick your Gmail account.
   * If you see **"Google hasn't verified this app"**, click **Advanced**, then **Go to RSVP (unsafe)**.
     It says "unsafe" only because Google hasn't reviewed it. It's your own script, running in your own Sheet.
   * Click **Allow**.
5. Click **Invitation → 1. Set up sheets** again if it didn't finish. You'll now see the tabs **Summary**,
   **Guests**, **Responses** and **Log** at the bottom.

### 3d. Type your guest list

Open the **Guests** tab. Make one row per invitation, meaning per household or per person you send a link to:

| Column | What to type | Example |
| --- | --- | --- |
| A — Code | **leave empty** | |
| B — Name | How the invitation should greet them | `Tita Maria` · `The Reyes Family` |
| C — Type | Choose from the dropdown: `Guest` or `Godparent` | `Godparent` |
| D — Role | Godparents only: `Ninong` or `Ninang` | `Ninang` |
| E — Max Guests | Seats you reserve for them, **including them** | `2` |
| F — Contact | Optional phone number, for your eyes only | `0917…` |
| G — Notes | Anything | |
| H — Invitation Link | **leave empty** | |

### 3e. Turn the script into a mini web service

1. Go back to the **Apps Script** tab.
2. Click the blue **Deploy** button (top-right), then **New deployment**.
3. Next to **Select type**, click the **⚙ gear icon** and choose **Web app**.
4. Fill in:
   * **Description:** `RSVP`
   * **Execute as:** `Me (your Gmail)`
   * **Who has access:** **`Anyone`** ← important
5. Click **Deploy**. If asked, click **Authorize access** and allow again, as in 3c.
6. You'll see a **Web app URL** ending in `/exec`. Click **Copy** and paste it into Notepad for now.
   This is your **APPS_SCRIPT_URL**.

> If **Anyone** isn't in the list, you're on a work or school account. Make the Sheet with a personal Gmail
> account instead.

### 3f. Get your secret password

1. Go back to the **Sheet** tab.
2. Click **Invitation → Show website secret**.
3. Copy the long code it shows and paste it into Notepad. This is your **APPS_SCRIPT_SECRET**.
   Don't share it with anyone.

---

## Step 4 — Connect the website to the Sheet (5 min)

1. Go to <https://vercel.com> and open your **zane-christening** project.
2. Click **Settings** (top), then **Environment Variables** (left).
3. Add the first variable:
   * **Key:** `APPS_SCRIPT_URL`
   * **Value:** the `/exec` link from 3e
   * **Environments:** leave all ticked
   * Click **Save**
4. Add the second variable the same way:
   * **Key:** `APPS_SCRIPT_SECRET`
   * **Value:** the secret from 3f
   * Click **Save**
5. Publish again so the website picks them up. In the VS Code terminal, run:

   ```
   npx vercel --prod
   ```

---

## Step 5 — Create everyone's personal links (2 min)

1. In the Sheet, click **Invitation → 2. Set website address** and paste your site address from Step 2,
   e.g. `https://zane-christening.vercel.app`, then click **OK**.
2. Click **Invitation → 3. Generate codes & links**.
3. Column **H — Invitation Link** now has a personal link for every guest, like
   `https://zane-christening.vercel.app/i/K7M2QX9P`.

Added more guests later? Type them in and run **3. Generate codes & links** again. Old links never change.

---

## Step 6 — Test it yourself (10 min)

1. Add a test row in **Guests**: Name `Test Bear`, Type `Guest`, Max Guests `2`. Run **3. Generate codes & links**.
2. Open Test Bear's link **on your phone**. Check:
   * the envelope says **For Test Bear**, and tapping the seal opens it;
   * the RSVP section says **2 seats** are reserved.
3. Choose **Joyfully attending**, pick **2 people**, type a companion name, and tap **Confirm My Attendance**.
   You should see **"Thank you, Test Bear! Your RSVP has been saved."**
4. In the Sheet, the **Responses** tab has a new row and **Summary** shows 1 attending and 2 expected guests.
5. Open the link again and tap **Update my response** → **Unable to attend** → send.
   **Responses** still has just **one** row for Test Bear, now marked `No`. That's how duplicates are avoided.
6. Try a **Godparent** test row too: answer **"Will you be my Ninang?"**, then RSVP separately below it.
7. When you're happy, delete the test rows from **Guests**, **Responses** and **Log**.

---

## Step 7 — Send the invitations

Copy each guest's link from column H. A message you can adapt:

> Hi Tita Maria! 💕🧸 You're invited to Zane Emillienne's Christening on Sunday, December 6, 2026.
> Please open your personal invitation and RSVP here: https://zane-christening.vercel.app/i/K7M2QX9P
> Kindly reply by November 22. Thank you!

Send each person **their own** link only, because anyone with a link can answer for that invitation.
For a public post, such as a Facebook story, use the main address without `/i/…`. It shows the invitation
but asks people to use their personal link to RSVP.

---

## While RSVPs come in

* **Head-count:** open the **Summary** tab. *Still waiting on* lists who hasn't answered yet.
* **Give someone more seats:** change their **Max Guests** number in **Guests**.
* **Change text or photos on the site:** edit `src/config/event.ts` (photos are in `public/images/`), then
  run `npx vercel --prod` again.
* **Diaper size update:** same as above, using the `Size:` line in the gift guide.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| RSVP says **"RSVP opens soon"** | Step 4 isn't finished. Check both variable names are spelled exactly, then run `npx vercel --prod`. |
| **"We couldn't load your personal invitation details"** | The script URL or secret is wrong, or **Who has access** isn't **Anyone**. Redo 3e/3f and Step 4. |
| **"We couldn't find this invitation"** | The code in the link doesn't match column A. Copy the link again from column H. |
| You changed `Code.gs` and nothing changed | In Apps Script: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. |
| The **Invitation** menu is missing | Refresh the Sheet and wait 5–10 seconds. |
