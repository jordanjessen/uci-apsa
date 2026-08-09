# Board member photos

Put board member photographs in this folder, then point at them from
`data/leadership.json`.

For example, after uploading `jane-doe.jpg` here, set that person's `photo`
field to:

```json
"photo": "assets/img/board/jane-doe.jpg"
```

## Guidelines

- **Square** images work best — the site crops them into a circle.
- Around **400 × 400 pixels** is plenty.
- Keep each file under about **300 KB** so pages stay fast.
- Use **lower-case filenames with hyphens and no spaces**: `jane-doe.jpg`, not
  `Jane Doe Photo.JPG`.
- **Ask each person before publishing their photograph.**

If someone has no photo, leave their `photo` field as `""`. The site shows their
initials in a circle instead, which looks perfectly good — it will never display
a broken image.

*(This file also keeps the folder present in Git, which does not track empty
folders. Please leave it here.)*
