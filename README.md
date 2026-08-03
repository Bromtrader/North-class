# NORTH CLASS — Admin Guide

**"Together We Rise."**

This is the complete guide to running your NORTH CLASS website. It's written for someone with **no coding experience** — if you can edit a text file and copy/paste, you can manage this entire site.

> **The golden rule:** you will *never* need to open or edit an `.html`, `.css`, or core `.js` file to update content. Everything you add, remove, or change happens inside the seven files in the `/data` folder. The website rebuilds itself automatically from whatever is in there.

---

## Table of Contents

1. [Run the Website](#1-run-the-website)
2. [Add a New Student](#2-add-a-new-student)
3. [Edit Student Information](#3-edit-student-information)
4. [Manage Announcements](#4-manage-announcements)
5. [Manage Assignments](#5-manage-assignments)
6. [Manage the Gallery](#6-manage-the-gallery)
7. [Manage Events](#7-manage-events)
8. [Update the Timetable](#8-update-the-timetable)
9. [Change Website Settings](#9-change-website-settings)
10. [Deploy to GitHub Pages](#10-deploy-to-github-pages)
11. [Best Practices](#11-best-practices)
12. [Troubleshooting (FAQ)](#12-troubleshooting-faq)

---

## 1. Run the Website

### Folder structure

```
north-class/
├── index.html              ← Homepage
├── students.html            ← Student Directory
├── timetable.html           ← Timetable
├── assignments.html         ← Assignments
├── gallery.html              ← Gallery
├── announcements.html       ← Announcements
├── events.html               ← Events
├── contact.html              ← Contact
├── 404.html                  ← Custom "Page Not Found"
├── robots.txt
├── README.md                 ← You are here
│
├── /data                     ★ EVERYTHING YOU EDIT LIVES HERE ★
│   ├── config.js              → site title, motto, theme, contact, music
│   ├── students.js            → the student directory
│   ├── announcements.js       → announcements
│   ├── assignments.js         → assignments
│   ├── gallery.js             → gallery photo list
│   ├── events.js               → events + countdowns
│   └── timetable.js            → the weekly timetable
│
├── /assets
│   ├── /images/students/       → upload student photos here
│   ├── /images/gallery/        → upload gallery photos here
│   ├── /images/logo/           → the site logo (logo.svg)
│   ├── /icons/                 → favicon.svg
│   └── /audio/                 → background-music.mp3 goes here
│
├── /css                       → visual styling (don't need to touch)
└── /JS                        → site logic (don't need to touch)
```

**You only ever work inside `/data` and `/assets`.** The `/css` and `/JS` folders make the site look and behave the way it does — you don't need to open them.

### Opening the project locally

1. Download / unzip the project folder anywhere on your computer.
2. Double-click **`index.html`**. It opens directly in your browser (Chrome, Edge, Firefox, Safari all work).
3. That's it — no installation, no server, no command line required.

### Testing before uploading

Every time you edit a file in `/data`, save it, then **refresh the browser tab** (`Ctrl+R` / `Cmd+R`). Your change appears immediately. Always do a quick pass through all 8 pages before publishing:

- [ ] Homepage stats look right
- [ ] New students appear in the Directory
- [ ] Timetable highlights today's lesson correctly
- [ ] Assignments show the right due dates
- [ ] Gallery images load
- [ ] Announcements appear, pinned ones first
- [ ] Events countdown correctly
- [ ] Contact page shows your teachers and details

> 💡 If a page looks broken after an edit, it's almost always a small typo in a data file (a missing comma, or a missing quotation mark). See [Troubleshooting](#12-troubleshooting-faq).

---

## 2. Add a New Student

**Step 1 — Upload the photo.**
Put the student's photo in:
```
assets/images/students/
```
Use a simple, consistent file name — lowercase, no spaces. Example: `amara-whitfield.jpg`.
(Don't have a photo yet? Skip this — see the field guide below.)

**Step 2 — Open `data/students.js`.**

**Step 3 — Add a new entry** inside the `STUDENTS` array. Copy this block, paste it inside the square brackets `[ ]`, and fill in the details:

```js
{
  id: "std-002",
  name: "Amara Whitfield",
  admissionNumber: "NC-2026-014",
  photo: "assets/images/students/amara-whitfield.jpg",
  nickname: "Ama",
  favoriteSubject: "Physics",
  futureCareer: "Aerospace Engineer",
  bio: "Builds tiny rockets on weekends and never sits still in class."
},
```

**Step 4 — Save the file and refresh the browser.** The new card appears instantly on the Students page, and the homepage "Students" statistic updates itself.

### Field guide

| Field | Required? | What it is |
|---|---|---|
| `id` | ✅ Yes | A unique code with no spaces, e.g. `"std-002"`. Every student needs a *different* id. |
| `name` | ✅ Yes | Full name, shown on the card and directory. |
| `admissionNumber` | ✅ Yes | School ID number. |
| `photo` | Optional | Path to their photo. Leave as `""` (empty) and a colorful initials avatar is generated automatically. |
| `nickname` | Optional | Shown in quotes under their name. |
| `favoriteSubject` | Optional | Shown on the card. |
| `futureCareer` | Optional | Shown on the card. |
| `bio` | Optional | One or two sentences, shown when their card is clicked. |

### A complete example, start to finish

```js
const STUDENTS = [
  {
    id: "std-001",
    name: "Jayden Cole",
    admissionNumber: "NC-2026-001",
    photo: "assets/images/students/jayden-cole.jpg",
    nickname: "JC",
    favoriteSubject: "Computer Science",
    futureCareer: "Software Engineer",
    bio: "Once built a robot out of the vending machine's spare parts."
  },
  {
    id: "std-002",
    name: "Amara Whitfield",
    admissionNumber: "NC-2026-014",
    photo: "assets/images/students/amara-whitfield.jpg",
    nickname: "Ama",
    favoriteSubject: "Physics",
    futureCareer: "Aerospace Engineer",
    bio: "Builds tiny rockets on weekends and never sits still in class."
  }
];
```

Notice the **comma** after the closing `}` of each student except the very last one — that's the most common typo, so double-check it.

---

## 3. Edit Student Information

All of this happens inside `data/students.js`.

- **Change a name / subject / bio, etc.** — find the student's block (search for their name with `Ctrl+F`), edit the value between the quotation marks, save, refresh.
- **Replace a photo** — upload the new image to `assets/images/students/` (it can reuse the same filename to overwrite the old one, or use a new filename and update the `photo:` path to match).
- **Remove a student** — delete their entire `{ ... }` block, including the trailing comma. Make sure the surrounding commas still make sense (see [Troubleshooting](#12-troubleshooting-faq) if the page breaks after removing someone).

---

## 4. Manage Announcements

Open `data/announcements.js`.

**Add one:**
```js
{
  id: "ann-004",
  title: "Midterm Timetable Released",
  message: "Check the Timetable page — exam week schedules are now live.",
  category: "Academic",
  date: "2026-08-10",
  pinned: true
},
```

- `category` can be any of: `"General"`, `"Academic"`, `"Urgent"`, `"Event"`, `"Achievement"` — each gets its own color.
- `date` must be in `"YYYY-MM-DD"` format.
- `pinned: true` keeps it at the very top of the homepage preview and the full timeline, with a highlighted badge. Set it to `false` (or remove the line) for a normal announcement.

**Pin / unpin:** change `pinned: true` to `pinned: false` (or the reverse) on the entry you want.

**Edit:** change the text inside the quotation marks for `title` or `message`.

**Delete:** remove the whole `{ ... }` block.

The homepage always shows the 3 most recent (pinned first); the full Announcements page shows everything as a timeline, with category filter buttons.

---

## 5. Manage Assignments

Open `data/assignments.js`.

**Add one:**
```js
{
  id: "asg-006",
  subject: "Mathematics",
  teacher: "Mr. Bello",
  title: "Trigonometry Problem Set",
  description: "Questions 1–20 from Chapter 7.",
  dueDate: "2026-08-15",
  status: "In Progress",
  priority: "High",
  progress: 40
},
```

| Field | Allowed values |
|---|---|
| `status` | `"Not Started"`, `"In Progress"`, `"Completed"`, `"Overdue"` |
| `priority` | `"Low"`, `"Medium"`, `"High"` |
| `progress` | A number 0–100 (drives the progress bar) |

**Mark as completed:** set `status: "Completed"` and `progress: 100`.

**Edit a due date:** change the `dueDate` value — always `"YYYY-MM-DD"`.

**Change priority:** edit the `priority` field to `"Low"`, `"Medium"`, or `"High"`.

The Assignments page includes a live search box and filter chips (by status) automatically — you don't configure those, they build themselves from whatever statuses exist in your data.

---

## 6. Manage the Gallery

**Step 1 — Upload images** to `assets/images/gallery/`.

**Step 2 — List them** in `data/gallery.js`:
```js
{
  id: "img-005",
  src: "assets/images/gallery/sports-day-01.jpg",
  category: "Sports Day",
  caption: "Relay finals, June 2026",
  alt: "Students running a relay race on the school field"
},
```

- `category` is free text — use the same word consistently (e.g. always `"Sports Day"`, not sometimes `"sports day"`) so the filter buttons group them correctly. A new category button appears automatically the first time you use a new category name.
- `alt` is a short description for screen readers — good for accessibility, worth filling in.

**Remove an image:** delete its block from `gallery.js` (you can leave the file in `assets/images/gallery/` or delete it too — either is fine, an unused file just sits there unused).

**Optimizing images for faster loading:**
- Resize photos to roughly **1600px** on the longest side before uploading — anything larger just slows the page down without looking sharper.
- Save as `.jpg` for photos (smaller file size than `.png`).
- Free tools: [squoosh.app](https://squoosh.app) (drag-and-drop, no install) or your phone's built-in "Markup/Edit" resize.
- Aim for under 500KB per photo where possible.

---

## 7. Manage Events

Open `data/events.js`.

**Add one:**
```js
{
  id: "evt-003",
  title: "Inter-House Sports Day",
  description: "Annual track and field competition on the main field.",
  date: "2026-09-12T09:00:00",
  location: "Main School Field",
  category: "Sports"
},
```

- `date` needs the time attached, in this exact shape: `"YYYY-MM-DDTHH:MM:SS"` (24-hour clock). Example: 2:30 PM on September 12, 2026 is `"2026-09-12T14:30:00"`.

**Edit a date:** change the `date` value — the countdown recalculates itself, no other change needed.

**Remove an event:** delete its `{ ... }` block.

**Countdown timers** update automatically, every second, purely based on today's date compared to the event's date — you never set or reset a countdown manually. Once an event's date/time passes, it automatically moves from "Upcoming" into the "Past Events" archive at the bottom of the page.

---

## 8. Update the Timetable

Open `data/timetable.js`.

```js
const TIMETABLE = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  periods: [
    { day: "Monday", subject: "Mathematics", teacher: "Mr. Bello",
      room: "Room 4", start: "08:00", end: "08:40" },
    { day: "Monday", subject: "English", teacher: "Ms. Okoye",
      room: "Room 4", start: "08:40", end: "09:20" },
  ]
};
```

- **Edit a subject:** change the `subject` value.
- **Change lesson times:** edit `start` / `end` — 24-hour format, e.g. `"14:00"` for 2 PM.
- **Update a teacher:** change the `teacher` value.
- **Add a day** (e.g. a Saturday class): add it to the `days` list, then add `period` entries with `day: "Saturday"`.
- **Highlighting the current lesson** is fully automatic — the site compares the visitor's device clock to each lesson's `start`/`end` time and day, and glows the matching cell. You never need to set this by hand; just keep your times accurate.

---

## 9. Change Website Settings

Almost everything site-wide lives in **`data/config.js`**.

| To change... | Edit this in `config.js` |
|---|---|
| Website title / browser tab text | `site.title`, `site.shortName` |
| Class motto ("Together We Rise.") | `site.motto` |
| Tagline under the eyebrow ("Elite Class Portal") | `site.tagline` |
| Homepage welcome paragraph | `site.welcomeMessage` |
| School name | `site.schoolName` |
| Theme colors (the aurora gradient) | `theme.auroraGreen`, `theme.auroraViolet`, `theme.auroraMagenta` — use any hex color code |
| Default dark/light mode | `theme.defaultMode` → `"dark"` or `"light"` |
| Logo | Replace `assets/images/logo/logo.svg` with your own file (same name), **or** point `site.logo` at a new filename |
| Favicon | Replace `assets/icons/favicon.svg`, or point `site.favicon` at a new filename |
| Contact email / phone / address | `contact.email`, `contact.phone`, `contact.address` |
| Google Maps embed | `contact.mapEmbedUrl` — see below |
| Social media links | `contact.socials.instagram`, `.x`, `.facebook`, `.whatsapp`, `.tiktok` — leave any as `""` to hide that icon |
| Teacher contact cards | The `teachers` array — same pattern as students, one block per teacher |
| Background music | See the **Music** section below |

### Getting a Google Maps embed link

1. Open [Google Maps](https://maps.google.com) and search your school.
2. Click **Share** → **Embed a map**.
3. Copy just the URL inside `src="..."` from the code Google gives you.
4. Paste that URL as the value of `contact.mapEmbedUrl` in `config.js`.

### Music

1. Add your audio file to `assets/audio/` and name it exactly `background-music.mp3` (or update `music.file` in `config.js` to match a different filename).
2. That's it — the mute/unmute button in the navbar activates itself automatically once a valid file is present. If no file exists yet, the button quietly disables itself instead of showing an error.
3. To swap tracks later, just replace the file (keeping the same name) or change `music.file`.
4. Browsers block audio from auto-playing with sound, so it always starts muted — visitors press the button to turn it on. This is normal browser behavior, not a bug.

---

## 10. Deploy to GitHub Pages

You don't need to know how to code for this — just follow along.

### Step 1 — Create a GitHub account & repository
1. Go to [github.com](https://github.com) and sign up (skip if you already have an account).
2. Click the **+** icon top-right → **New repository**.
3. Name it anything, e.g. `north-class` (this becomes part of your website's web address).
4. Set it to **Public**, then click **Create repository**.

### Step 2 — Upload the project
1. On your new repository's page, click **Add file** → **Upload files**.
2. Drag your entire NORTH CLASS project folder's *contents* into the upload box (the files themselves, not the outer folder — `index.html` should end up directly in the repository root).
3. Scroll down, add a short message like `Initial upload`, and click **Commit changes**.

### Step 3 — Enable GitHub Pages
1. In your repository, click **Settings** (top menu).
2. In the left sidebar, click **Pages**.
3. Under **Branch**, choose **main** and folder **/ (root)**, then click **Save**.
4. Wait 1–2 minutes. GitHub shows a green box with your live URL, usually:
   ```
   https://YOUR-USERNAME.github.io/REPOSITORY-NAME/
   ```

### Step 4 — Visit your live site
Open that link in your browser. Your NORTH CLASS site is now live for anyone with the link.

### Updating the website after it's live
Every time you want to change something (add a student, post an announcement, etc.):
1. Edit the relevant file in `/data` on your computer.
2. On GitHub, open that same file (e.g. `data/students.js`) and click the pencil ✏️ **Edit** icon.
3. Paste in your updated content, replacing what's there.
4. Scroll down, add a commit message like `Add new student`, click **Commit changes**.
5. GitHub Pages rebuilds automatically within about a minute — refresh your live site to see it.

> Alternative: re-upload the whole project via **Add file → Upload files** any time — GitHub will ask to confirm you're replacing the existing files.

---

## 11. Best Practices

- **Organizing images:** keep one subfolder purpose per folder — student photos only in `/students/`, gallery photos only in `/gallery/`. Don't mix them.
- **Consistent file names:** lowercase, hyphens instead of spaces (`sports-day-01.jpg`, not `Sports Day 01.JPG`). This avoids broken links, since file paths are case-sensitive on GitHub Pages even though they may not be on your own computer.
- **Back up the project:** before a big batch of edits, copy the whole folder somewhere safe (or rely on GitHub itself — every commit is saved automatically, so you can always look at or restore an older version from the repository's **History**).
- **Improving performance:** resize photos before upload (see [Gallery](#6-manage-the-gallery)); keep the number of extremely large images on one page reasonable.
- **Maintaining accessibility:** always fill in the `alt` field for gallery photos and meaningful `bio`/`name` fields for students — screen readers rely on this text.
- **One change at a time:** when adding several students/events/etc. at once, save and refresh after each one if you're new to this — it's much easier to spot which entry has a typo.

---

## 12. Troubleshooting (FAQ)

**A whole page looks empty / broken after I edited a data file.**
This is almost always a syntax typo — a missing comma between entries, a missing closing `}`, or a missing quotation mark. Open the file and check the entry you last edited especially closely. Every entry except the last one in a list needs a comma after its closing `}`.

**My new student / photo isn't showing up.**
- Check the `photo` path exactly matches the uploaded filename, including capitalization and file extension (`.jpg` vs `.jpeg` vs `.png`).
- Make sure you added the new entry *inside* the square brackets `[ ]` of the array.
- Hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`) — sometimes browsers cache the old file.

**Images not appearing at all.**
- Double check the file actually uploaded to the right folder (`assets/images/students/` or `assets/images/gallery/`).
- File paths are case-sensitive online even if they weren't on your computer — `Photo.JPG` and `photo.jpg` are different files to GitHub Pages.

**The website isn't updating after I pushed changes to GitHub.**
- GitHub Pages can take 1–2 minutes to rebuild after a commit. Wait, then hard-refresh.
- Check the **Actions** tab in your repository — if a deployment failed, it'll show a red ❌ with details.
- Confirm you edited the file inside the repository (not just on your own computer without uploading it).

**Broken links / a nav link goes to a blank GitHub page.**
- Make sure every `.html` file was uploaded to the **root** of the repository, not inside a subfolder — `index.html`, `students.html`, etc. should all sit next to each other.

**GitHub Pages deployment problems.**
- Confirm **Settings → Pages → Branch** is set to `main` and `/ (root)`.
- Confirm the repository is **Public** (Pages on a free plan requires this, unless you're on GitHub's paid Pro/Team tiers).
- Make sure `index.html` is spelled exactly like that, lowercase, in the root folder.

**JavaScript errors in the browser console.**
- Open your browser's Developer Tools (`F12` or right-click → Inspect → Console tab).
- Red error messages usually name the exact file and line number — 9 times out of 10 it points to a typo in one of the `/data` files (see the first FAQ above).
- If the error mentions `gsap` or `Lenis` and you're testing **completely offline** with no internet connection, that's expected — those two libraries load from the internet for smooth-scroll/animation polish, and the site is built to still work fully without them, just with slightly simpler motion.

**Missing files after uploading to GitHub.**
- Re-check that you dragged the *contents* of the project folder, not the folder itself, into GitHub's upload box.
- Use **Add file → Upload files** again and drag any files you notice are missing.

**Music button is greyed out / does nothing.**
- No audio file has been added yet. See the [Music](#9-change-website-settings) section — add `background-music.mp3` to `assets/audio/`.

**The contact form doesn't send anything.**
- This is expected — GitHub Pages hosts static files only, with **no backend server**, so the form can't send mail on its own. Submitting it opens the visitor's own email app with the message pre-filled, addressed to whatever email is set in `contact.email`. If you want true in-page submissions without opening an email app, connect a free third-party form service like [Formspree](https://formspree.io) or [EmailJS](https://www.emailjs.com) — both have simple copy-paste setup guides on their own sites.

---

*Built for NORTH CLASS. Edit freely, own it fully.*
