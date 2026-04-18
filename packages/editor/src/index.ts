/* ─── @mandato360/editor — Public API ─── */

// Main editor component
export { SiteEditor } from "./components/site-editor"

// Types
export type {
  EditorConfig,
  SiteEditorProps,
  EditorPlugin,
  PluginSectionProps,
  PluginSidebarProps,
  DeviceType,
  SectionType,
  ThemeConfig,
  HeaderConfig,
  HeroConfig,
  HeroOverridableProps,
  FooterConfig,
  GradientConfig,
  GradientStop,
  ImagePosition,
  DesignSystemConfig,
  ThemePresetType,
  OrientationType,
  FontFamily,
  ThemePreset,
  AccordionType,
} from "./types"

// Hooks (for advanced usage)
export { useEditor, type UseEditorOptions, type UseEditorReturn } from "./hooks/use-editor"
export { resolveHero, hasOverride, useResolvedHero, type ResolvedHero } from "./hooks/use-resolved-config"

// Utilities
export { cn } from "./lib/utils"
export { renderMarkdown } from "./lib/markdown-renderer"
