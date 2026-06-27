"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Shield,
  Users,
  GearSix,
  SignOut,
  Gauge,
  ArrowLeft,
} from "@phosphor-icons/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthed(true);
      return;
    }
    async function check() {
      try {
        const res = await fetch("/api/admin/verify");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        setAuthed(true);
      } catch {
        router.push("/admin/login");
      }
    }
    check();
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!authed) return null;

  const navItems = [
    { href: "/admin", label: "แดชบอร์ด", icon: Gauge },
    { href: "/admin/users", label: "ผู้ใช้", icon: Users },
    { href: "/admin/settings", label: "ตั้งค่า", icon: GearSix },
  ];

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Shield weight="duotone" size={24} />
          <span>Admin</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${active ? "active" : ""}`}
              >
                <Icon weight="duotone" size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-nav-item">
            <ArrowLeft weight="duotone" size={20} />
            <span>กลับไปแอป</span>
          </Link>
          <button className="admin-nav-item" onClick={handleLogout}>
            <SignOut weight="duotone" size={20} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      <main className="admin-workspace">
        {children}
      </main>
    </div>
  );
}
