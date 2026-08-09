# How to edit this website

This guide explains how to make a change to the site using nothing but a web
browser. You do not need to install anything, you do not need to use Terminal,
and you do not need to know Git.

If you are looking for *what* to change rather than *how*, see
[README.md](README.md).

---

## Before you start

You need two things:

1. **A GitHub account.** Free, at [github.com](https://github.com).
2. **Write access to this repository.** Ask the current President or Webmaster
   to add you: they go to **Settings → Collaborators → Add people** and enter
   your GitHub username.

If you can see a **pencil icon** in the top right when you open a file in this
repository, you have access.

---

## The basic workflow

Every change follows the same five steps.

### 1. Open the file

Click through the folders on the repository's main page until you find the file
you want. The two you will use most often are:

- `data/events.json` — the events
- `data/leadership.json` — the board

### 2. Click the pencil icon

It is at the top right of the file view, and its tooltip says **Edit this file**.
The file becomes an editable text box.

### 3. Make your change

Type directly into the box. See the [rules for JSON files](#the-rules-for-json-files)
below — they matter, and there are only four of them.

### 4. Describe what you did

Scroll to the bottom. There is a box labelled **Commit changes** with a
one-line description field.

Write something a human would understand:

- ✅ `Add March symposium to events`
- ✅ `Update Sam's bio and add photo`
- ✅ `Fix typo on About page`
- ❌ `update`
- ❌ `changes`
- ❌ `asdf`

This is not bureaucracy. In two years, when someone is trying to work out when
something changed and why, these one-line notes are the only record. They take
five seconds to write.

### 5. Commit

Leave **Commit directly to the `main` branch** selected, and click
**Commit changes**.

**That's it.** The live website updates by itself, usually within 30 to 90
seconds. You can watch progress in the **Actions** tab if you want to see it
happening.

---

## The rules for JSON files

The two files in the `data` folder are JSON. JSON is picky, but it only has four
rules worth memorizing.

### Rule 1 — Every block needs a comma after it, except the last one

```json
{
  "board": [
    { "name": "First Person",  "role": "President" },      ← comma
    { "name": "Second Person", "role": "Vice President" },  ← comma
    { "name": "Last Person",   "role": "Treasurer" }        ← NO comma
  ]
}
```

**This causes more broken pages than everything else combined.** When you delete
the last person in a list, you have to remove the comma from the new last
person. When you add someone to the end, you have to add a comma to the person
who used to be last.

### Rule 2 — Text goes in double quotes

```json
"name": "Jane Doe"
```

Not single quotes, not curly "smart" quotes. If you write your text in Word or
Google Docs first and paste it in, Word will silently convert your quotes into
curly ones and the file will break. **Type directly into GitHub, or paste through
a plain text editor.**

### Rule 3 — Leave the field names alone

In `"name": "Jane Doe"`, the part on the left is a field name the website looks
for. Change `"Jane Doe"` all you like. Do not change `"name"`.

### Rule 4 — An empty value is `""`, not blank

```json
"photo": ""       ✅  correct — means "no photo"
"photo":          ❌  breaks the file
```

---

## Checking your work before you commit

**GitHub checks JSON for you as you type.** If you introduce a syntax error, a
red mark appears in the left margin next to the offending line. Hover over it to
see what is wrong. If you see a red mark, fix it before committing.

You can also click the **Preview** tab at the top of the editor to see your
changes rendered, though for JSON the red-margin check is more useful.

If you would rather be completely certain, copy the whole file's contents into a
free online JSON validator and paste it back if it passes.

---

## Uploading a photo

1. Navigate to `assets/img/board` on GitHub.
2. Click **Add file → Upload files**.
3. Drag your image into the browser window.
4. Write a commit description, e.g. `Add photo for Jane Doe`.
5. Click **Commit changes**.
6. Then edit `data/leadership.json` and set that person's `photo` value to
   `assets/img/board/your-file-name.jpg`.

Photos should be roughly square, around 400 × 400 pixels, under 300 KB, with
lower-case filenames containing no spaces. **Always ask the person first.**

---

## Undoing a mistake

Nothing you do here is permanent. Every version of every file is kept forever.

**To undo your last change:**

1. Open the file on GitHub.
2. Click **History** (top right of the file view).
3. Click the commit you want to undo.
4. Click the **···** menu at the top right, then **Revert**.
5. Commit the revert.

**To see what a file looked like before:** from the same History view, click any
commit to see exactly what changed, line by line, with additions in green and
deletions in red.

**If the live site is broken and you are not sure why:** revert the most recent
commit. That will almost always fix it, and you can work out what went wrong
afterwards without the site being down.

---

## Editing the actual pages

Everything above covers the two data files, which is what most updates need. If
you need to change wording on a page — the About text, say — the process is
identical: open the `.html` file, click the pencil, edit, commit.

**A few cautions when editing HTML:**

- Text sits between tags: in `<p>Hello</p>`, edit `Hello` and leave the `<p>`
  and `</p>` alone.
- Every opening tag has a matching closing tag. If you delete one, delete both.
- Anything between `<!--` and `-->` is a comment. It does not appear on the
  site; it is a note for whoever is editing. Several of them mark places that
  still need real content.
- **The header and footer are duplicated in all eight HTML files.** This is a
  deliberate trade-off: it keeps the site working with no build step, but it
  means that if you change a navigation link or the footer, you must make the
  same change in every `.html` file. There are eight. Do not skip one.
- Do not edit `assets/css/styles.css` unless you intend to change the site's
  appearance, and read the notes at the top of that file first.

---

## Working on something bigger

For a small text fix, committing straight to `main` is fine and is what this
guide recommends.

For a larger change — restructuring a page, redesigning something, anything you
want a second opinion on before it goes live — use a branch instead:

1. In the editor, before committing, select **Create a new branch for this commit
   and start a pull request**.
2. Give the branch a short name, e.g. `new-about-page`.
3. Click **Propose changes**, then **Create pull request**.
4. Ask another officer to look at it.
5. When you are both happy, click **Merge pull request**.

The live site does not change until the pull request is merged, so you can take
your time.

---

## Getting help

- Read [README.md](README.md) — it covers most tasks in detail.
- Both JSON files start with a `_readme` section explaining every field.
- If a page shows an error message, read it. They were written to explain what
  went wrong and what to do about it, in plain language.
- Still stuck? Revert your last commit to get the site back to working, then ask
  for help without any time pressure.
