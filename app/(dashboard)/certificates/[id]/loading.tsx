export default function Loading() {
  return (
    <div style={{ padding: "32px 40px" }}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow" style={{ height: 16, width: 120, background: "var(--crease)", borderRadius: 4 }} />
          <div style={{ height: 32, width: 280, background: "var(--crease)", borderRadius: 6, marginTop: 8 }} />
        </div>
        <div className="ws-header-actions" style={{ gap: 8, display: "flex" }}>
          <div style={{ height: 36, width: 80, background: "var(--crease)", borderRadius: 8 }} />
          <div style={{ height: 36, width: 80, background: "var(--crease)", borderRadius: 8 }} />
          <div style={{ height: 36, width: 80, background: "var(--crease)", borderRadius: 8 }} />
        </div>
      </header>

      <div className="ws-body" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <div style={{ width: "100%", aspectRatio: "4/3", background: "var(--crease)", borderRadius: 12 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ height: 20, width: 180, background: "var(--crease)", borderRadius: 4 }} />
          <div style={{ height: 16, width: 260, background: "var(--crease)", borderRadius: 4 }} />
          <div style={{ height: 14, width: 100, background: "var(--crease)", borderRadius: 4 }} />
          <div style={{ height: 60, width: "100%", background: "var(--crease)", borderRadius: 6, marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div style={{ height: 26, width: 60, background: "var(--crease)", borderRadius: 20 }} />
            <div style={{ height: 26, width: 80, background: "var(--crease)", borderRadius: 20 }} />
            <div style={{ height: 26, width: 70, background: "var(--crease)", borderRadius: 20 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
