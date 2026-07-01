export type HeroBackground = "gradient" | "solid" | "none";

export type SectionName = "profile" | "certificates";

export type DesignSettings = {
  preset: string;
  accent_color: string | null;
  hero: {
    background_type: HeroBackground;
    background_value: string;
    subtitle: string;
  };
  typography: {
    heading_font: string;
    body_font: string;
  };
  layout: {
    cert_columns: 2 | 3 | 4;
    section_order: SectionName[];
  };
};

export const DESIGN_DEFAULTS: DesignSettings = {
  preset: "lavender",
  accent_color: null,
  hero: {
    background_type: "gradient",
    background_value: "",
    subtitle: "",
  },
  typography: {
    heading_font: "Mali",
    body_font: "Mali",
  },
  layout: {
    cert_columns: 3,
    section_order: ["profile", "certificates"],
  },
};

export const GOOGLE_FONTS = [
  "Mali",
  "Sarabun",
  "Noto Sans Thai",
  "Kanit",
  "Prompt",
  "Chakra Petch",
  "Anuphan",
  "IBM Plex Sans Thai",
  "Sriracha",
  "Mitr",
] as const;

export function mergeDesignSettings(settings: Partial<DesignSettings> | null | undefined): DesignSettings {
  const s = { ...DESIGN_DEFAULTS };
  if (!settings) return s;
  if (settings.preset) s.preset = settings.preset;
  if (settings.accent_color !== undefined) s.accent_color = settings.accent_color;
  if (settings.hero) {
    if (settings.hero.background_type) s.hero.background_type = settings.hero.background_type;
    if (settings.hero.background_value !== undefined) s.hero.background_value = settings.hero.background_value;
    if (settings.hero.subtitle !== undefined) s.hero.subtitle = settings.hero.subtitle;
  }
  if (settings.typography) {
    if (settings.typography.heading_font) s.typography.heading_font = settings.typography.heading_font;
    if (settings.typography.body_font) s.typography.body_font = settings.typography.body_font;
  }
  if (settings.layout) {
    if (settings.layout.cert_columns) s.layout.cert_columns = settings.layout.cert_columns;
    if (settings.layout.section_order) s.layout.section_order = settings.layout.section_order;
  }
  return s;
}

export function presetAccent(preset: string): string {
  const map: Record<string, string> = {
    lavender: "#f87195",
    warm: "#c4842d",
    mint: "#2d9d7a",
    slate: "#3b82f6",
  };
  return map[preset] || "#f87195";
}

export function heroGradient(preset: string, accent: string): string {
  const color = accent || presetAccent(preset);
  return `linear-gradient(135deg, ${color}22 0%, ${color}44 50%, ${color}11 100%)`;
}
