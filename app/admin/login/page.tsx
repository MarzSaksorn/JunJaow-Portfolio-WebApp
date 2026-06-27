"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card" style={{ maxWidth: 400 }}>
        <div className="login-header">
          <div className="binder-mark" style={{ width: 48, height: 48, fontSize: 22 }}>
            AD
          </div>
          <h1>ผู้ดูแลระบบ</h1>
          <p className="ws-eyebrow" style={{ textAlign: "center" }}>
            แผงควบคุมผู้ดูแล
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>รหัสผ่านผู้ดูแล</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={4}
              autoFocus
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </main>
  );
}
