// Re-export shim. Original lived here; the helpers were promoted to
// services/themeLogo.ts so other themes (magazine, corporate, future
// externals) can use them via the public @flexweg/cms-runtime API
// without cross-importing the default theme.
export {
  logoPath,
  uploadThemeLogo,
  removeThemeLogo,
} from "../../services/themeLogo";
