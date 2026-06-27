"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "@phosphor-icons/react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    if (newPassword.length < 4) {
      setError("รหัสผ่านใหม่อย่างน้อย 4 ตัวอักษร");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch {
      setError("เกิดข้อผิดพลาด");
      setLoading(false);
    }
  }

  return (
    <div>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">ตั้งค่าระบบ</p>
          <h1>เปลี่ยนรหัสผ่านผู้ดูแล</h1>
        </div>
      </header>

      <div className="ws-body">
        <form className="panel" onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Shield weight="duotone" size={24} />
            <h4 style={{ margin: 0 }}>รหัสผ่านผู้ดูแลระบบ</h4>
          </div>

          <div className="form-field">
            <label>รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-field">
            <label>รหัสผ่านใหม่</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={4}
            />
          </div>

          <div className="form-field">
            <label>ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={4}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && (
            <p style={{ color: "var(--tab-mint)", fontSize: 14, marginTop: 8 }}>
              เปลี่ยนรหัสผ่านสำเร็จ
            </p>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
          </button>
        </form>
      </div>
    </div>
  );
}
