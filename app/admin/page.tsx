"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Users, Certificate, FileText, User } from "@phosphor-icons/react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCertificates: 0,
    totalPortfolios: 0,
    totalProfiles: 0,
    recentUsers: [] as { id: string; email: string; created_at: string }[],
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/users");
      if (!res.ok) return;
      const { users } = await res.json();
      setStats({
        totalUsers: users.length,
        totalCertificates: users.reduce((s: number, u: any) => s + (u.certificate_count || 0), 0),
        totalPortfolios: 0,
        totalProfiles: users.filter((u: any) => u.has_profile).length,
        recentUsers: users.slice(0, 5),
      });

      const supabase = createClient();
      const { count: portfolioCount } = await supabase
        .from("portfolio_pages")
        .select("*", { count: "exact", head: true });
      setStats((prev) => ({ ...prev, totalPortfolios: portfolioCount || 0 }));
    }
    load();
  }, []);

  const metrics = [
    { label: "ผู้ใช้ทั้งหมด", value: stats.totalUsers, icon: Users, color: "clip" },
    { label: "ประกาศนียบัตร", value: stats.totalCertificates, icon: Certificate, color: "pink" },
    { label: "พอร์ตโฟลิโอ", value: stats.totalPortfolios, icon: FileText, color: "mint" },
    { label: "โปรไฟล์", value: stats.totalProfiles, icon: User, color: "lavender" },
  ];

  return (
    <div>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">แผงควบคุม</p>
          <h1>แดชบอร์ดผู้ดูแลระบบ</h1>
        </div>
      </header>

      <div className="ws-body">
        <div className="admin-metric-grid">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className={`admin-metric ${m.color}`}>
                <Icon weight="duotone" size={28} />
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            );
          })}
        </div>

        <div className="panel" style={{ marginTop: 24 }}>
          <h3 style={{ margin: "0 0 12px" }}>ผู้ใช้ล่าสุด</h3>
          {stats.recentUsers.length === 0 ? (
            <p style={{ color: "var(--ink-muted)" }}>ยังไม่มีผู้ใช้</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {stats.recentUsers.map((u) => (
                <div key={u.id} className="admin-user-row">
                  <div className="admin-user-email">{u.email}</div>
                  <div className="admin-user-date">
                    {new Date(u.created_at).toLocaleDateString("th-TH")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
