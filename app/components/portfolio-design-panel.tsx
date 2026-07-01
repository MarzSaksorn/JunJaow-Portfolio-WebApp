"use client";

import { presets } from "@/lib/color-themes";
import {
  DesignSettings,
  GOOGLE_FONTS,
} from "@/lib/portfolio-design";

interface Props {
  settings: DesignSettings;
  onChange: (s: DesignSettings) => void;
}

export function PortfolioDesignPanel({ settings, onChange }: Props) {
  function update(partial: Partial<DesignSettings>) {
    onChange({ ...settings, ...partial });
  }

  function updateHero(partial: Partial<DesignSettings["hero"]>) {
    update({ hero: { ...settings.hero, ...partial } });
  }

  function updateTypography(partial: Partial<DesignSettings["typography"]>) {
    update({ typography: { ...settings.typography, ...partial } });
  }

  function updateLayout(partial: Partial<DesignSettings["layout"]>) {
    update({ layout: { ...settings.layout, ...partial } });
  }

  return (
    <aside className="design-panel">
      {/* Theme */}
      <section className="design-section">
        <h3 className="design-section-title">ธีมสี</h3>
        <div className="design-presets">
          {presets.map((p) => (
            <button
              key={p.id}
              className={`design-preset-btn${settings.preset === p.id ? " active" : ""}`}
              onClick={() => update({ preset: p.id, accent_color: null })}
            >
              <span className="design-preset-swatch" style={{ background: p.accent }} />
              <span className="design-preset-name">{p.name}</span>
            </button>
          ))}
        </div>

        <label className="design-field">
          <span>สีเน้นกำหนดเอง</span>
          <div className="design-color-row">
            <input
              type="color"
              value={settings.accent_color || presetAccent(settings.preset)}
              onChange={(e) => update({ accent_color: e.target.value })}
              className="design-color-picker"
            />
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => update({ accent_color: null })}
            >
              ใช้สีธีม
            </button>
          </div>
        </label>
      </section>

      {/* Hero */}
      <section className="design-section">
        <h3 className="design-section-title">ส่วนหัว</h3>

        <label className="design-field">
          <span>พื้นหลัง</span>
          <select
            value={settings.hero.background_type}
            onChange={(e) => updateHero({ background_type: e.target.value as any })}
            className="design-select"
          >
            <option value="gradient">เกรเดียนต์</option>
            <option value="solid">สีพื้น</option>
            <option value="none">ไม่มี</option>
          </select>
        </label>

        {settings.hero.background_type === "solid" && (
          <label className="design-field">
            <span>สีพื้น</span>
            <input
              type="color"
              value={settings.hero.background_value || "#f5f0fa"}
              onChange={(e) => updateHero({ background_value: e.target.value })}
              className="design-color-picker"
            />
          </label>
        )}

        <label className="design-field">
          <span>คำอธิบายใต้ชื่อ</span>
          <input
            type="text"
            value={settings.hero.subtitle}
            onChange={(e) => updateHero({ subtitle: e.target.value })}
            placeholder="เช่น ผลงานตลอดการเรียน ม.ปลาย"
            className="design-input"
          />
        </label>
      </section>

      {/* Fonts */}
      <section className="design-section">
        <h3 className="design-section-title">ตัวอักษร</h3>

        <label className="design-field">
          <span>หัวข้อ</span>
          <select
            value={settings.typography.heading_font}
            onChange={(e) => updateTypography({ heading_font: e.target.value })}
            className="design-select"
          >
            {GOOGLE_FONTS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>

        <label className="design-field">
          <span>เนื้อหา</span>
          <select
            value={settings.typography.body_font}
            onChange={(e) => updateTypography({ body_font: e.target.value })}
            className="design-select"
          >
            {GOOGLE_FONTS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>
      </section>

      {/* Layout */}
      <section className="design-section">
        <h3 className="design-section-title">เค้าโครง</h3>

        <label className="design-field">
          <span>คอลัมน์ประกาศนียบัตร</span>
          <div className="design-column-options">
            {([2, 3, 4] as const).map((n) => (
              <button
                key={n}
                className={`design-col-btn${settings.layout.cert_columns === n ? " active" : ""}`}
                onClick={() => updateLayout({ cert_columns: n })}
              >
                {n}
              </button>
            ))}
          </div>
        </label>

        <label className="design-field">
          <span>ลำดับส่วน</span>
          <div className="design-section-order">
            {settings.layout.section_order.map((name, i) => (
              <div key={name} className="design-order-item">
                <span>{name === "profile" ? "โปรไฟล์" : "ประกาศนียบัตร"}</span>
                <div className="design-order-arrows">
                  <button
                    className="btn btn-xs btn-ghost"
                    disabled={i === 0}
                    onClick={() => {
                      const order = [...settings.layout.section_order];
                      [order[i - 1], order[i]] = [order[i], order[i - 1]];
                      updateLayout({ section_order: order });
                    }}
                  >
                    ▲
                  </button>
                  <button
                    className="btn btn-xs btn-ghost"
                    disabled={i === settings.layout.section_order.length - 1}
                    onClick={() => {
                      const order = [...settings.layout.section_order];
                      [order[i + 1], order[i]] = [order[i], order[i + 1]];
                      updateLayout({ section_order: order });
                    }}
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>
        </label>
      </section>
    </aside>
  );
}

function presetAccent(preset: string): string {
  const map: Record<string, string> = {
    lavender: "#f87195",
    warm: "#c4842d",
    mint: "#2d9d7a",
    slate: "#3b82f6",
  };
  return map[preset] || "#f87195";
}
