import { NodeViewWrapper } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import { SLIDERS, type SliderAttrs, type SliderKind } from "./sliders";

interface SliderNodeViewProps {
  kind: SliderKind;
  attrs: SliderAttrs;
  updateAttrs: (patch: Partial<SliderAttrs>) => void;
  selected: boolean;
}

// In-editor block preview. Renders the same HTML the publisher would
// produce so authors see what they'll get without a publish round-trip.
// The runtime JS isn't loaded inside the editor — controls are static
// (no autoplay, no swipe) but the layout matches the live page.
//
// Selection state borrows the standard Tiptap convention: an extra
// outline when `selected` is true. The actual edit affordance lives in
// the Block-tab Inspector (SliderInspector) — clicking the block in the
// editor selects it; the inspector becomes active.
export function SliderNodeView({ kind, attrs, selected }: SliderNodeViewProps) {
  const { t } = useTranslation("flexweg-sliders");
  const def = SLIDERS[kind];
  const html = def.renderHtml(attrs);
  const slidesLen = countSlides(kind, attrs);
  const kindLabel = t(`blocks.${kind}.title`);

  return (
    <NodeViewWrapper
      as="div"
      className="flexweg-sliders-nodeview"
      style={{
        position: "relative",
        outline: selected ? "2px solid var(--primary, #0ea5e9)" : "1px dashed rgba(0,0,0,.15)",
        borderRadius: ".5rem",
        padding: ".25rem",
        margin: "1rem 0",
        cursor: "pointer",
      }}
      data-drag-handle
    >
      <div
        className="flexweg-sliders-nodeview-label"
        style={{
          position: "absolute",
          top: ".25rem",
          right: ".5rem",
          fontSize: ".7rem",
          padding: ".15rem .5rem",
          background: "rgba(0,0,0,.65)",
          color: "#fff",
          borderRadius: "9999px",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {t("preview.blockLabel", { kind: kindLabel, n: slidesLen })}
      </div>
      {slidesLen === 0 ? (
        <div className="fws-placeholder">{t(`empty.${kind}`)}</div>
      ) : (
        <div
          aria-hidden="true"
          // The rendered HTML is generated entirely from typed attrs
          // — no user-controlled HTML reaches innerHTML. esc() in
          // sliders.ts escapes every text/attribute value before
          // assembly.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </NodeViewWrapper>
  );
}

function countSlides(kind: SliderKind, attrs: SliderAttrs): number {
  if (kind === "logo") {
    return (attrs as { logos?: unknown[] }).logos?.length ?? 0;
  }
  return (attrs as { slides?: unknown[] }).slides?.length ?? 0;
}
