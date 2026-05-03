# Flexweg Blocks

A pack of layout primitives for the post / page editor. Theme-agnostic — every block here works with any active theme because it ships its own minimal CSS.

## Blocks

### Columns

Splits a section of the page into 2, 3 or 4 side-by-side columns. Each column accepts any other block — paragraphs, headings, lists, embeds, even theme blocks like Hero or Posts list.

**Usage**:

1. Click the **+** inserter on an empty paragraph.
2. Pick **Columns** from the **Layout** category.
3. The block inserts with 2 empty columns by default. Click inside a column to start typing or use the **+** inserter inside it to add another block.

**Inspector options**:

- **Number of columns** — 2, 3 or 4. Increasing adds new empty columns to the right; decreasing removes the trailing columns *with their content* (Tiptap undo recovers).

**Responsive behavior**:

On mobile (≤ 768 px) every columns layout collapses to a single stacked column automatically — no toggle needed. The vertical order matches the source order in the editor.

**Limitations**:

- Nesting Columns inside Columns is not blocked at the schema level but isn't recommended — the visual outcome on mobile (deeply stacked content) and desktop (cramped grids) is rarely what you want.
- The block toolbar (move up/down, duplicate, delete) acts on the **whole Columns container**, not individual blocks within columns. To rearrange blocks inside a column, cut and paste them manually.
- The 24 px gap between columns is fixed in v1 — open an issue if you need a tighter / wider option.

## When to disable it

Disable if your editorial workflow only needs single-column posts and you want a tighter inserter UI. The plugin is purely additive — disabling stops the blocks from appearing in the inserter, existing content using them keeps rendering on the public site (the publish-time transforms still process the markup).
