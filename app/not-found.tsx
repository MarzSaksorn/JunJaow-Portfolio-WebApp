import Link from "next/link";

export default function NotFound() {
  return (
    <main className="login-page" id="main-content" style={{ textAlign: "center" }}>
      <div className="login-card" style={{ padding: "48px 32px" }}>
        <div className="login-card-clip" />
        <h1 style={{ fontSize: 64, margin: "24px 0 0", lineHeight: 1, letterSpacing: "-0.04em" }}>
          404
        </h1>
        <p style={{ margin: "12px 0 24px", fontSize: 14, color: "var(--ink-muted)" }}>
          ไม่พบหน้าที่คุณกำลังมองหา
        </p>
        <Link href="/" className="btn btn-primary">
          กลับหน้าแรก
        </Link>
      </div>
    </main>
  );
}
