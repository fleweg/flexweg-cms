export interface SpacerAttrs {
  size?: "sm" | "md" | "lg";
  divider?: boolean;
}

export function renderSpacer(attrs: SpacerAttrs): string {
  const size = attrs.size ?? "md";
  const divider = attrs.divider === true;
  return `<div class="cms-spacer cms-spacer-${size}${divider ? " cms-spacer-divider" : ""}" aria-hidden="true"></div>`;
}
