"use client";

import { useRef, useState } from "react";
import { useEntranceAnimation } from "@/lib/animations";
import { presets, applyPreset, getSavedPreset } from "@/lib/color-themes";
import { CheckCircle } from "@phosphor-icons/react";

export default function SettingsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useEntranceAnimation(rootRef);
  const [active, setActive] = useState(getSavedPreset);

  function handleSelect(id: string) {
    setActive(id);
    applyPreset(id);
  }

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">ตั้งค่า</p>
          <h1>ธีมสี</h1>
        </div>
      </header>

      <div className="ws-body">
        <div className="form-card" data-entrance-form>
          <p style={{ color: "var(--ink-muted)", fontSize: 14, marginBottom: 20 }}>
            เลือกชุดสีสำหรับทั้งระบบ
          </p>

          <div className="theme-grid">
            {presets.map((p) => (
              <button
                key={p.id}
                className={`theme-card${active === p.id ? " active" : ""}`}
                onClick={() => handleSelect(p.id)}
              >
                <div className="theme-swatch" style={{ background: p.accent }} />
                <div className="theme-body">
                  <strong>{p.name}</strong>
                  <span>{p.nameEn}</span>
                  <small>{p.desc}</small>
                </div>
                {active === p.id && (
                  <span className="theme-check">
                    <CheckCircle weight="fill" size={18} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
