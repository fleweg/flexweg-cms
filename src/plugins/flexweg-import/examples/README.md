# Examples — markdown import fixtures

Sample markdown files exercising every feature of the import format. Drop the whole folder into the plugin's drag-and-drop zone (or upload to `_cms-import/` on Flexweg) and click **Scan** to see what each file produces.

## Files

| File | What it tests |
|---|---|
| `01-minimal.md` | Bare-minimum post — just `title` + body. |
| `02-complete-post.md` | Every supported frontmatter field set. |
| `03-page-about.md` | `type: page` instead of post. |
| `04-hierarchical-category.md` | `parentCategory` builds a `News > Tech` hierarchy. |
| `05-with-images.md` | `heroImage` + inline `![alt](filename.png)` references. Drop the `images/` folder alongside. |
| `06-online-with-date.md` | `status: online` + `publishedAt` — published immediately when import status mode is "From source" or "Always publish". |
| `07-tags-and-author.md` | Multiple tags (auto-created) + `author:` resolved by email. |

## Running them

### Drag-and-drop mode

1. Enable **Flexweg Import** in `/admin/#/plugins`.
2. Open `/admin/#/settings/plugin/flexweg-import`.
3. Switch source to **Drag and drop**.
4. Drag the entire `examples/` folder (including `images/`) into the drop zone.
5. Click **Scan** → review the dry-run summary.
6. Click **Confirm import**.

### Folder mode

1. Click **Initialize import folder** to create `_cms-import/` on your Flexweg site.
2. Upload the `.md` files to `_cms-import/`.
3. Upload the `images/` subfolder contents to `_cms-import/images/`.
4. Click **Refresh listing** → **Scan** → **Confirm import**.

## Expected outcome

After a successful import with default settings (status mode = draft):

- 6 posts + 1 page in **draft** status (file `06-online-with-date.md` would be online if you set status mode to "From source").
- New categories: `News`, `News > Tech`, `Sports`, `Recipes`, `About`. (Names depend on what already exists in your site.)
- New tags: `intro`, `welcome`, `breaking`, `migration`, `2026`, `easy`, `cooking`, `pasta`.
- 2 media files: `cover.png`, `photo.png`.

## Resetting between runs

If you want to re-import the same examples after testing:
- **Drag-drop mode**: just drop again — nothing was archived.
- **Folder mode**: move the files back from `_cms-import/processed-<timestamp>/` to `_cms-import/` (or disable the **Move processed files** toggle in Defaults before importing).
- **Wipe the imported content**: delete the created posts / pages / terms / media manually in the admin. The importer doesn't track what it created — it's a fire-and-forget pipeline.
