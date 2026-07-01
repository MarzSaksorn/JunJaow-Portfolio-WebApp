"use client";

import { useEffect, useState } from "react";
import { usePageEntrance } from "@/hooks/use-page-entrance";
import { Trash, UserPlus } from "@phosphor-icons/react";

type ManagedUser = {
  id: string;
  email: string;
  created_at: string;
  disabled: boolean;
  certificate_count: number;
  has_profile: boolean;
};

export default function AdminUsersPage() {
  const rootRef = usePageEntrance<HTMLDivElement>();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function loadUsers() {
    const res = await fetch("/api/admin/users");
    if (!res.ok) return;
    const { users } = await res.json();
    setUsers(users);
    setLoading(false);
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, password: newPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setCreating(false);
      return;
    }

    setNewEmail("");
    setNewPassword("");
    setShowCreate(false);
    setCreating(false);
    loadUsers();
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`ลบผู้ใช้ ${email}? ข้อมูลทั้งหมดจะถูกลบ`)) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    loadUsers();
  }

  async function handleToggle(id: string, disabled: boolean) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: !disabled }),
    });
    loadUsers();
  }

  return (
    <div ref={rootRef}>
      <header className="ws-header" data-animate="fade-up" data-order="1">
        <div>
          <p className="ws-eyebrow">จัดการผู้ใช้</p>
          <h1>ผู้ใช้ทั้งหมด</h1>
        </div>
        <div className="ws-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(!showCreate)}
          >
            <UserPlus weight="duotone" /> เพิ่มผู้ใช้
          </button>
        </div>
      </header>

      <div className="ws-body" data-animate="fade-up" data-order="2">
        {showCreate && (
          <form className="panel" onSubmit={handleCreate} style={{ marginBottom: 16 }}>
            <h4 style={{ margin: "0 0 12px" }}>สร้างผู้ใช้ใหม่</h4>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
              <div className="form-field" style={{ margin: 0 }}>
                <label>อีเมล</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="form-field" style={{ margin: 0 }}>
                <label>รหัสผ่าน</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            {error && <p className="form-error">{error}</p>}
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="btn btn-primary" type="submit" disabled={creating}>
                {creating ? "กำลังสร้าง..." : "สร้าง"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setShowCreate(false)}>
                ยกเลิก
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>กำลังโหลด...</p>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>ยังไม่มีผู้ใช้</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>อีเมล</th>
                  <th>ลงทะเบียน</th>
                  <th>ประกาศนียบัตร</th>
                  <th>โปรไฟล์</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} data-animate-stagger>
                    <td className="admin-cell-email">{u.email}</td>
                    <td>{new Date(u.created_at).toLocaleDateString("th-TH")}</td>
                    <td>{u.certificate_count}</td>
                    <td>{u.has_profile ? "✅" : "—"}</td>
                    <td>
                      <span className={`admin-badge ${u.disabled ? "badge-danger" : "badge-active"}`}>
                        {u.disabled ? "ปิดใช้งาน" : "ใช้งาน"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-cell-actions">
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={() => handleToggle(u.id, u.disabled)}
                        >
                          {u.disabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </button>
                        <button
                          className="btn btn-secondary btn-xs"
                          style={{ color: "var(--destructive)" }}
                          onClick={() => handleDelete(u.id, u.email)}
                        >
                          <Trash weight="duotone" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
