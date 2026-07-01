"use client";


import { useRef } from "react";

export default function EditLoading() {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow" style={{ height: 16, width: 120, background: "var(--crease)", borderRadius: 4 }} />
          <div style={{ height: 32, width: 200, background: "var(--crease)", borderRadius: 6, marginTop: 8 }} />
        </div>
      </header>

      <div className="ws-body" style={{ marginTop: 24 }}>
        <div className="form-card" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[140, 200, 280, 160].map((w, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ height: 12, width: 60, background: "var(--crease)", borderRadius: 3 }} />
                  <div style={{ height: 40, width: w, background: "var(--crease)", borderRadius: 8 }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[120, 160, 200, "100%"].map((w, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ height: 12, width: 50, background: "var(--crease)", borderRadius: 3 }} />
                  <div style={{ height: 40, width: w === "100%" ? "100%" : w, background: "var(--crease)", borderRadius: 8 }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <div style={{ height: 36, width: 80, background: "var(--crease)", borderRadius: 8 }} />
            <div style={{ height: 36, width: 140, background: "var(--crease)", borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
