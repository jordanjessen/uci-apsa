# UC Irvine APSA Local Chapter — Website

This is the complete website for the UC Irvine local chapter of the American
Physician Scientists Association.

**This guide is written for the next board, not for a programmer.** You do not
need to know how to code to keep this site up to date. You do not need to
install anything. Everything can be done in a web browser.

---

## Table of contents

1. [The 60-second version](#the-60-second-version)
2. [Before the site goes live: the TODO checklist](#before-the-site-goes-live-the-todo-checklist)
3. [How to add or update a board member](#how-to-add-or-update-a-board-member)
4. [How to add an event](#how-to-add-an-event)
5. [How to add a photo](#how-to-add-a-photo)
6. [How to change the membership form link](#how-to-change-the-membership-form-link)
7. [How to change the chapter email address](#how-to-change-the-chapter-email-address)
8. [How to preview your changes](#how-to-preview-your-changes)
9. [How deployment works](#how-deployment-works)
10. [Annual handover checklist](#annual-handover-checklist)
11. [If something breaks](#if-something-breaks)
12. [What each file does](#what-each-file-does)
13. [Design and technical notes](#design-and-technical-notes)

---

## The 60-second version

The two things that change every year — **events** and **the board** — live in
two plain text files inside the `data` folder:

| To change | Edit this file |
|---|---|
| Events on the Events page and home page | `data/events.json` |
| Board members on the Leadership page | `data/leadership.json` |

You edit those two files directly on GitHub's website. About a minute after you
save, the live site updates by itself. You never have to touch the HTML, the
styling, or anything else.

Step-by-step instructions for editing on GitHub are in
**[CONTRIBUTING.md](CONTRIBUTING.md)**. Read that first if you have never done
this before.

---

## Before the site goes live: the TODO checklist

The site was built with placeholders wherever real chapter information was not
yet available. **Every placeholder contains the word `TODO`,** so you can find
them all by searching the repository for `TODO` (on GitHub, press `/` and search,
or use the search box at the top of the repository page).

Work through these before announcing the site:

- [ ] **Chapter email address.** Replace `TODO-EMAIL@uci.edu` everywhere. See
      [How to change the chapter email address](#how-to-change-the-chapter-email-address).
- [ ] **Real events.** `data/events.json` ships with two clearly-marked example
      events. Replace them with real ones and delete the examples.
- [ ] **Board bios.** Every board member in `data/leadership.json` has a
      `bio` starting with `TODO`. Write two or three sentences for each.
- [ ] **Board photos.** Optional but recommended. Until a photo is added, the
      site shows the person's initials in a circle, which looks fine.
- [ ] **Faculty advisor.** Fill in the `advisor` section of
      `data/leadership.json` once an advisor has agreed to serve.
- [ ] **Verify the Resources links.** `resources.html` has a yellow notice at
      the top and several entries marked `TODO` where the exact page address
      still needs confirming. Check them, fix them, then delete the notice.
- [ ] **Check the officer years.** `data/leadership.json` lists each officer's
      year (MS2, MS4 and so on) as recorded on the chapter officer form. Confirm
      these are still correct for the current academic year.
- [ ] **Keep the constitution in step.** The constitution is published in full at
      `constitution.html` and linked from the About page, with the Word original
      downloadable from `assets/docs/uci-apsa-chapter-constitution.docx`. If the
      membership amends it, amend the Word document first, replace the file in
      `assets/docs/`, then update `constitution.html` to match it word for word.

> **A note on privacy.** Please do not publish anyone's home address or personal
> phone number on this site. Individual officer email addresses are also left
> blank on purpose — addresses posted on public web pages get harvested by spam
> senders. The Contact page routes everything through one chapter address
> instead. If a board member wants their email published, they can add it to
> their entry in `data/leadership.json`.

---

## How to add or update a board member

1. Go to the file `data/leadership.json` in this repository on GitHub.
2. Click the pencil icon (**Edit this file**).
3. Find the `"board"` section. Each person is one block wrapped in `{` and `}`.
4. To **add** someone, copy an entire existing block, paste it below, and change
   the values. To **update** someone, just edit their values. To **remove**
   someone, delete their whole block.
5. Scroll down, write a short note in the description box (for example
   `Add new secretary`), and click **Commit changes**.

A person's entry looks like this:

```json
{
  "name": "Jane Doe",
  "role": "Secretary",
  "program": "M.D./Ph.D.",
  "year": "MS3",
  "bio": "Jane studies neuroimmunology in the Smith lab and is interested in how chronic inflammation shapes recovery after stroke.",
  "photo": "assets/img/board/jane-doe.jpg",
  "email": ""
}
```

**Things worth knowing:**

- **Order matters.** People appear on the page in the same order they appear in
  the file. To move someone up the page, move their block up.
- **Every block needs a comma after it, except the last one.** This is the single
  most common mistake. If the Leadership page shows an error message, look here
  first.
- **Leave `photo` as `""` if there is no photo.** The site will show the
  person's initials in a circle. It will never show a broken image.
- **`email` is optional.** Leave it as `""` to publish no address.
- To advertise an unfilled position, add `"vacant": true` to the block. The page
  will show it as an open seat inviting nominations.

---

## How to add an event

1. Go to `data/events.json` and click the pencil icon.
2. Copy one whole block between `{` and `}`, paste it inside the square
   brackets, and edit the values.
3. Commit the change.

An event looks like this:

```json
{
  "id": "career-pathways-night",
  "title": "Physician-Scientist Career Pathways Night",
  "status": "planned",
  "start": "2026-10-21T17:30:00-07:00",
  "end": "2026-10-21T19:00:00-07:00",
  "location": "Medical Education Building, Room 140",
  "format": "In person + Zoom",
  "committee": "Career Planning",
  "summary": "An invited physician-scientist talks about how a research career actually gets assembled and funded, followed by questions and dinner.",
  "rsvpUrl": ""
}
```

**You never have to sort events or move old ones.** The website compares each
event's finish time with the current time and files it under **Upcoming** or
**Past** automatically. An event moves across on its own the moment it ends.

**Understanding the date format.** `"2026-10-21T17:30:00-07:00"` means
21 October 2026 at 5:30 PM California time. Reading it in pieces:

```
2026-10-21  T  17:30:00  -07:00
   date         time      time zone
                (24-hour)
```

- Use `-07:00` for dates in Pacific **Daylight** time, roughly March to November.
- Use `-08:00` for dates in Pacific **Standard** time, roughly November to March.
- Getting this slightly wrong shifts the displayed time by one hour. It will not
  break the page.
- If you only know the day and not the time, you can write just `"2026-10-21"`
  and no time will be shown.

**The `status` field.** Use `"planned"` for an event that is scheduled but not
fully confirmed — it displays a gold **PLANNED** badge and a note that dates may
move. Use `"confirmed"` once the room and date are locked; no badge is shown.

**The `rsvpUrl` field.** Paste a link to a sign-up form to add a "Details and
RSVP" link to the card. Leave it as `""` for no link.

---

## How to add a photo

1. On GitHub, open the folder `assets/img/board`.
2. Click **Add file → Upload files**, and drag your image in.
3. Click **Commit changes**.
4. Edit `data/leadership.json` and set that person's `photo` to
   `assets/img/board/the-file-name.jpg`.

**Photo tips:**

- Square pictures work best — the site crops them into a circle.
- Around 400 × 400 pixels is plenty. Larger files just make the page slower.
- Keep it under about 300 KB.
- Use lower-case filenames with hyphens and no spaces: `jane-doe.jpg`, not
  `Jane Doe Photo.JPG`.
- **Ask each person before publishing their photograph.**

---

## How to change the membership form link

The Google Form address appears in **exactly one place** on the whole site. Every
"Join the chapter" button anywhere else leads to the Get Involved page, so you
only ever have to change it once.

1. Open `get-involved.html`.
2. Search for `forms.gle`. It is the `href` on the "Open the membership form"
   button, just below a comment block explaining that this is the only copy.
3. Replace the whole web address with the new form's share link.

The link currently points at <https://forms.gle/CcRBKxNCcAmbrR5C8>.

---

## How to change the chapter email address

The email address appears in the footer of every page, which means it is in all
eight `.html` files, plus twice on `contact.html`.

**On GitHub:** use the repository search box to search for `TODO-EMAIL@uci.edu`.
It will list every file containing it. Open each one, click the pencil, and
replace it. There are nine occurrences in total.

**On your own computer,** if you are comfortable with Terminal, you can do all of
them in one command from inside the website folder:

```bash
grep -rl 'TODO-EMAIL@uci.edu' . | xargs sed -i '' 's/TODO-EMAIL@uci.edu/your-real-address@uci.edu/g'
```

(On Windows or Linux, drop the `''` after `-i`.)

---

## How to preview your changes

**Option 1 — Just commit it. This is the normal way.**

Edit the file on GitHub and commit. About a minute later the live site updates.
If something looks wrong, you can undo it in a few clicks — see
[If something breaks](#if-something-breaks). For text and data edits this is
genuinely the easiest and safest approach, and it is what we recommend.

**Option 2 — Preview on your own computer.**

If you want to check something before it goes live, you need to run a tiny local
web server. This sounds harder than it is, and it is a single command.

> **Why can't I just double-click `index.html`?**
> You can, and most of the site will look completely normal. But the Events and
> Leadership sections will show a polite message instead of their content. That
> is not a bug. Browsers deliberately refuse to let a page opened directly from
> your hard drive read other files next to it, as a security measure. Running a
> local server sidesteps that. The live site is never affected.

1. Download the repository: on GitHub, click **Code → Download ZIP**, then
   unzip it.
2. Open **Terminal** (on Mac: press `Cmd + Space`, type `Terminal`, press Enter).
3. Type `cd ` — including the space — then drag the unzipped folder onto the
   Terminal window and press Enter.
4. Type this and press Enter:

   ```bash
   python3 -m http.server 8000
   ```

5. Open your browser to **http://localhost:8000**

Press `Ctrl + C` in Terminal to stop the server when you are done.

---

## How deployment works

This site is hosted free by **GitHub Pages**. There is no server to maintain, no
hosting bill, and no password to lose.

**How it works:** whenever anyone commits a change to the `main` branch of this
repository, GitHub automatically republishes the site. It usually takes 30 to 90
seconds. You can watch progress in the **Actions** tab of the repository.

**One-time setup** (only needed if the site has never been published):

1. Go to the repository's **Settings** tab.
2. Click **Pages** in the left sidebar.
3. Under **Source**, choose **Deploy from a branch**.
4. Set the branch to **main** and the folder to **/ (root)**.
5. Click **Save**. The address appears at the top of that page after a minute.

**About the `.nojekyll` file.** There is an empty file in this repository named
`.nojekyll`. GitHub Pages normally runs published files through a blog engine
called Jekyll, which ignores files and folders whose names begin with an
underscore. That empty file switches Jekyll off, so our files are published
exactly as they are. **Do not delete it.**

---

## Annual handover checklist

Give this section to whoever takes over the site.

- [ ] Add the incoming board to `data/leadership.json`, and remove the outgoing
      board.
- [ ] Update `boardYear` at the top of that file, e.g. `"2027–2028"`.
- [ ] Add the new year's planned events to `data/events.json`. Old events do not
      need to be deleted — they move to the Past section by themselves, and are
      worth keeping as a record of what the chapter has done.
- [ ] Confirm the chapter email address still reaches someone who reads it.
- [ ] Check that the membership form link still points at the current year's
      form.
- [ ] Re-check the links on the Resources page. University web addresses change
      more often than you would think.
- [ ] Make sure at least two officers have access to this repository, so access
      is never lost when one person graduates. Under the chapter constitution
      this is the Webmaster's responsibility, but in practice give it to the
      President as well.

---

## If something breaks

**Almost everything that goes wrong is a comma in a JSON file.** JSON is strict:
every block needs a comma after it *except the last one*, and a stray comma after
the final block will stop the whole file loading.

The site tries hard to tell you this rather than just showing a blank page. If a
data file has a typo, the page displays a message saying so and pointing at the
likely cause.

**To check a file before committing:** GitHub highlights JSON syntax errors as
you type in its editor — look for a red mark in the left margin. You can also
paste the file's contents into any free "JSON validator" website.

**To undo a change:**

1. Go to the file on GitHub.
2. Click **History** at the top right.
3. Find the commit before things broke and click it.
4. Click the **···** menu at the top right, then **Revert**.

Nothing you can do through GitHub's web editor is permanent. Every version is
kept and any change can be reversed.

---

## What each file does

```
uci-apsa-site/
├── index.html            Home page
├── about.html            About the chapter, mission, committees, governance
├── events.html           Events (content comes from data/events.json)
├── leadership.html       Board (content comes from data/leadership.json)
├── get-involved.html     How to join — HOLDS THE GOOGLE FORM LINK
├── resources.html        National APSA, applications, funding, UCI links
├── contact.html          Contact details and who handles what
├── 404.html              Shown when someone follows a broken link
├── .nojekyll             Tells GitHub Pages to publish files as-is. Keep it.
├── sitemap.xml           List of pages, for search engines. Edit only if
│                         you add or remove a whole page.
├── robots.txt            Tells crawlers everything is allowed, and points
│                         them at sitemap.xml. Must stay at the root.
├── README.md             This guide
├── CONTRIBUTING.md       Step-by-step editing instructions
│
├── data/                 ← THE ONLY FOLDER MOST PEOPLE NEED
│   ├── events.json           Events. Edit this.
│   └── leadership.json       Board members. Edit this.
│
└── assets/
    ├── css/styles.css        All styling for the whole site
    ├── js/
    │   ├── main.js               Mobile menu, footer year
    │   ├── render.js             Shared helpers for the two pages below
    │   ├── events.js             Puts events on the page
    │   └── leadership.js         Puts the board on the page
    ├── fonts/                Self-hosted fonts and their licenses
    └── img/
        ├── logo.svg             APSA wordmark, gold, for the site header
        ├── favicon.svg          The same wordmark on a blue browser-tab tile
        └── board/               Board member photos go here
```

Both JSON files begin with a `_readme` section containing instructions. It is
ignored by the website and exists purely to help whoever opens the file next.
Please keep it there and keep it accurate.

---

## Design and technical notes

*This section is for anyone who wants to change how the site looks, or who is
curious about why it was built this way.*

**No build step, on purpose.** This site is plain HTML, CSS and JavaScript. There
is no framework, no npm, no `package.json`, and nothing to compile. Open any file
in a text editor, change it, and it works. That decision was made so that someone
picking this up in five years, with no handover and no context, can still edit it.

**Everything is self-hosted.** The fonts live in this repository rather than
being loaded from Google Fonts. Icons are drawn inline in the HTML rather than
pulled from an icon library. Nothing on this site depends on an outside service
staying online, and no visitor data is sent to a third party.

**Colors.** All colors are defined once at the top of `assets/css/styles.css`,
under `01. DESIGN TOKENS`. Change a value there and it updates across the whole
site.

> **The one rule you must not break:** UC Irvine Gold (`#FECC07`) on a white
> background is a contrast ratio of 1.52:1. That is unreadable, and it fails
> accessibility requirements. Gold is used only on UCI blue, or as a non-text
> accent such as a rule or an icon. If you ever need gold-*colored text* on a
> light background, use the darker `--gold-ink` instead, which passes at 6.4:1.

The three dark surfaces are `--brand-base` (`#255799`, the UCI blue used for
the header, hero and page headers), `--brand-deep` (`#16345c`, footer and
call-to-action bands) and `--brand-card` (`#204d86`, cards sitting on a dark
section). Note that `--brand-card` is *darker* than `--brand-base`, not
lighter: `#255799` is light enough that any lighter card surface pushes gold
links below the 4.5:1 minimum, so raised panels are drawn as recessed ones.

**Type.** Headings are Source Serif 4; body text and interface are Inter. Both
are open-licensed variable fonts, so a single file covers a whole range of
weights — around 100 KB for the entire type system. Sizes use `clamp()`, so they
scale smoothly with the screen instead of jumping at fixed breakpoints.

**Accessibility.** The site was built to meet WCAG AA. Every text and background
pairing was checked for contrast; there is a skip link; the navigation is fully
keyboard operable with a visible focus ring; the current page is marked with
`aria-current`; images have appropriate alt text; heading levels are never
skipped; touch targets are at least 44 × 44 pixels; and animation is disabled for
anyone whose system asks for reduced motion. If you change the colors, please
re-check the contrast — the WebAIM Contrast Checker is free and takes a minute.

**Event times** are always displayed in California time, no matter where the
visitor is, so what appears on the screen always matches what appears on the
flyer.

**Browser support.** Everything works in any browser from roughly 2021 onward.
If JavaScript is switched off entirely, every page still displays its content and
the navigation still works; only the two data-driven lists need JavaScript.
