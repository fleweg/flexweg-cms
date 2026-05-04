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

### Custom HTML

Drops raw HTML, CSS or JavaScript anywhere in a post. Whatever you type runs verbatim on the published page — no sanitisation, no transformation.

**Usage**:

1. Insert the block from the **Layout** category in the **+** menu.
2. Type in the **HTML** tab.
3. Click **Preview** to see a sandboxed render of what your code will look like once published. The sandbox isolates scripts so they can't affect the editor itself.

**Common use cases**:

- Embedding a third-party widget (a booking calendar, a map, an analytics pixel)
- Including a `<style>` block that targets a specific section
- Pasting a snippet from a service that doesn't have a dedicated embed plugin yet

**Security note**:

Anything in this block is **not sanitised**. `<script>` tags execute on every visitor's browser. Don't paste code from untrusted sources, and review carefully when editing. The block flags this with a warning strip below the textarea.

**Limitations**:

- The in-editor preview uses an `allow-scripts` sandbox — most embeds work, but anything that needs `same-origin` access (cross-window communication, cookies) won't behave the same in the editor as it does live. Always check the published page after a save.
- Tiptap treats the block as an atom — you can't nest other blocks inside it, and the inline formatting / mention features don't apply. This is intentional: keeps your code untouched between save and publish.

## When to disable it

Disable if your editorial workflow only needs single-column posts with no custom code, and you want a tighter inserter UI. The plugin is purely additive — disabling stops the blocks from appearing in the inserter, existing content using them keeps rendering on the public site (the publish-time transforms still process the markup).
