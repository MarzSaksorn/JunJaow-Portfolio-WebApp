"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { ThemeToggle } from "./theme-toggle";
import { useEntranceAnimation } from "@/lib/animations";
import {
  House,
  Certificate,
  CalendarBlank,
  User,
  Folder,
  GearSix,
  SignOut,
  CaretLeft,
  CaretRight,
  ClockClockwise,
} from "@phosphor-icons/react";

const icons: Record<string, React.ReactNode> = {
  "/": <House weight="duotone" />,
  "/certificates": <Certificate weight="duotone" />,
  "/years": <CalendarBlank weight="duotone" />,
  "/timeline": <ClockClockwise weight="duotone" />,
  "/profile": <User weight="duotone" />,
  "/portfolio": <Folder weight="duotone" />,
  "/settings": <GearSix weight="duotone" />,
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement>(null);
  const [userEmail, setUserEmail] = useState("");
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("sidebar-collapsed") === "true",
  );

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  useEntranceAnimation(sidebarRef);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  const navItems = [
    { href: "/", label: "แดชบอร์ด", desc: "ภาพรวมผลงาน" },
    { href: "/certificates", label: "ประกาศนียบัตร", desc: "จัดการเอกสารทั้งหมด" },
    { href: "/years", label: "ปีการศึกษา", desc: "แยกตามปีที่เรียน" },
    { href: "/timeline", label: "เส้นเวลา", desc: "เรียงตามลำดับเวลา" },
    { href: "/profile", label: "ข้อมูลส่วนตัว", desc: "ประวัติและทักษะ" },
    { href: "/portfolio", label: "พอร์ตโฟลิโอ", desc: "สร้างหน้ารวมผลงาน" },
    { href: "/settings", label: "ตั้งค่า", desc: "ธีมสีและการตั้งค่า" },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  function handleNavClick(href: string) {
    const currentIdx = navItems.findIndex(item => isActive(item.href));
    const targetIdx = navItems.findIndex(item => {
      if (item.href === "/") return href === "/";
      return href.startsWith(item.href);
    });
    if (targetIdx < currentIdx) sessionStorage.setItem("nav-dir", "up");
    else sessionStorage.setItem("nav-dir", "down");
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className={`binder${collapsed ? " binder--collapsed" : ""}`} ref={sidebarRef} data-entrance-sidebar>
      <div className="binder-head">
        <Link href="/" className="binder-mark" aria-label="หน้าแรก">Jj</Link>
        <span className="binder-name">JunJaow</span>
      </div>

      <nav className="binder-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`binder-link${isActive(item.href) ? " active" : ""}`}
            aria-label={item.label}
            onClick={() => handleNavClick(item.href)}
          >
            <span className="binder-link-icon">{icons[item.href]}</span>
            <span className="binder-link-label">
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </span>
          </Link>
        ))}
        <button
          className="binder-collapse"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "ขยายเมนู" : "ยุบเมนู"}
        >
          <span className="binder-link-icon">
            {collapsed ? <CaretRight weight="duotone" /> : <CaretLeft weight="duotone" />}
          </span>
          <span className="binder-link-label">
            <strong>{collapsed ? "ขยาย" : "ยุบเมนู"}</strong>
          </span>
        </button>
      </nav>

      <div className="binder-footer">
        <div className="binder-avatar" title={userEmail}>
          {userEmail?.charAt(0).toUpperCase() || "?"}
        </div>
        <ThemeToggle />
        <button
          className="binder-signout"
          onClick={handleSignOut}
          aria-label="ออกจากระบบ"
        >
          <SignOut weight="duotone" />
        </button>
      </div>
    </aside>
  );
}
