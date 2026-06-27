"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import gsap from "gsap";
import {
  Certificate,
  FolderOpen,
  CalendarBlank,
  User,
  ArrowRight,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import { fileIcon, iconClass } from "@/lib/file-icons";
import type { Database } from "@/lib/supabase/types";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
type Activity = {
  id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

const yearBorderClasses: Record<string, string> = {
  "2569": "clip-border",
  "2570": "pink-border",
  "2571": "mint-border",
  "2572": "lavender-border",
};

const dotTagColor = (cat: string | null) => {
  const colors = ["tag-clip", "tag-pink", "tag-mint", "tag-lavender"];
  if (!cat) return colors[0];
  let hash = 0;
  for (let i = 0; i < cat.length; i++) hash = ((hash << 5) - hash) + cat.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
};

export function DashboardClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState({
    totalCertificates: 0,
    recentCount: 0,
    yearCounts: {} as Record<string, number>,
    portfolioCount: 0,
    recentCerts: [] as Certificate[],
    profileCompletion: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const years = ["2569", "2570", "2571", "2572"];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const [{ count: totalCertificates }, { count: recentCount }, yearResult, { count: portfolioCount }, { data: recentCerts }, { data: profile }, activityRes] =
        await Promise.all([
          supabase.from("certificates").select("*", { count: "exact", head: true }).eq("owner_id", user.id),
          supabase.from("certificates").select("*", { count: "exact", head: true }).eq("owner_id", user.id).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
          supabase.from("certificates").select("academic_year").eq("owner_id", user.id).not("academic_year", "is", null),
          supabase.from("portfolio_pages").select("*", { count: "exact", head: true }).eq("owner_id", user.id),
          supabase.from("certificates").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }).limit(5),
          supabase.from("profiles").select("*").eq("owner_id", user.id).single(),
          supabase.from("activity_log").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }).limit(10),
        ]);

      if (cancelled) return;

      const yearCounts: Record<string, number> = {};
      yearResult.data?.forEach((c) => {
        if (c.academic_year) yearCounts[c.academic_year] = (yearCounts[c.academic_year] || 0) + 1;
      });

      const profileCompletion = profile
        ? [profile.full_name, profile.school, profile.bio, (profile.skills?.length || 0) > 0, (profile.activities?.length || 0) > 0].filter(Boolean).length * 20
        : 0;

      setData({
        totalCertificates: totalCertificates || 0,
        recentCount: recentCount || 0,
        yearCounts,
        portfolioCount: portfolioCount || 0,
        recentCerts: recentCerts || [],
        profileCompletion,
      });
      setActivities((activityRes.data || []) as Activity[]);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const blocks = el.querySelectorAll<HTMLElement>(".year-block");
    if (!blocks.length) return;
    const dir = sessionStorage.getItem("nav-dir") === "up" ? -1 : 1;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(blocks,
        {
          y: 56 * dir,
          rotation: (i) => (i - 1.5) * 10,
          autoAlpha: 0,
        },
        {
          y: 0,
          rotation: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          onComplete: () => blocks.forEach((b) => b.style.removeProperty("transform")),
        },
      );
    }, el);
    return () => mm.revert();
  }, []);

  useEntranceAnimation(rootRef);

  const { totalCertificates, recentCount, yearCounts, portfolioCount, recentCerts, profileCompletion } = data;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || recentCerts.length === 0) return;
    const cards = el.querySelectorAll<HTMLElement>(".cert-card");
    if (!cards.length) return;
    const dir = sessionStorage.getItem("nav-dir") === "up" ? -1 : 1;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(cards, { y: 20 * dir, autoAlpha: 0, duration: 0.3, stagger: 0.06, ease: "power2.out", clearProps: "transform" });
    }, el);
    return () => mm.revert();
  }, [recentCerts.length]);

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">จัดการพอร์ตโฟลิโออย่างรวดเร็ว</p>
          <h1>ความสำเร็จของคุณ<br />พร้อมเสมอ</h1>
        </div>
        <div className="ws-header-actions">
          <Link className="btn btn-secondary" href="/certificates">เรียกดูคลัง</Link>
          <Link className="btn btn-primary" href="/certificates/new">อัปโหลดไฟล์</Link>
        </div>
      </header>

      <div className="ws-body">
        <section className="year-spread">
          {years.map((year) => (
            <Link
              key={year}
              href={`/certificates?year=${year}`}
              className={`year-block ${yearBorderClasses[year]}`}
            >
              <div className="year-block-dot" />
              <span className="year-block-year">{year}</span>
              <span className="year-block-count">{yearCounts[year] || 0} รายการ</span>
            </Link>
          ))}
        </section>

        <div className="desk-layout">
          <div className="desk-paper" data-entrance-panel>
            <div className="desk-surface">
              <div className="metric-grid">
                <div className="metric-item clip">
                  <strong>{totalCertificates}</strong>
                  <span>+{recentCount} เดือนนี้</span>
                </div>
                <div className="metric-item pink">
                  <strong>{portfolioCount}</strong>
                  <span>หน้าพอร์ตโฟลิโอ</span>
                </div>
                <div className="metric-item mint">
                  <strong>{Object.keys(yearCounts).length}</strong>
                  <span>ปีการศึกษา</span>
                </div>
                <div className="metric-item lavender">
                  <strong>{profileCompletion}%</strong>
                  <span>โปรไฟล์พร้อม</span>
                </div>
              </div>

              <div className="panel-header" style={{ marginBottom: 16 }}>
                <div>
                  <p className="ws-eyebrow">ล่าสุด</p>
                  <h3>ประกาศนียบัตรล่าสุด</h3>
                </div>
                <Link className="btn btn-secondary btn-sm" href="/certificates">ดูทั้งหมด</Link>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {recentCerts.length === 0 ? (
                  <div className="empty-state" style={{ padding: "32px 16px" }}>
                    <p>ยังไม่มีประกาศนียบัตร</p>
                    <Link className="btn btn-primary" href="/certificates/new">
                      อัปโหลดอันแรก
                    </Link>
                  </div>
                ) : (
                  recentCerts.map((cert) => (
                    <Link
                      key={cert.id}
                      href={`/certificates/${cert.id}`}
                      className="cert-card"
                    >
                      <div className={`cert-card-tab ${yearBorderClasses[cert.academic_year || ""] || "clip-border"}`} />
                      <div className="cert-card-body">
                        <div className={`cert-card-icon ${iconClass(cert.file_type || "")}`}>
                          {fileIcon(cert.file_type || "")}
                        </div>
                        <div className="cert-card-info">
                          <h4>{cert.title}</h4>
                          <p>{cert.issuer || "—"}</p>
                          <div className="cert-card-meta">
                            {cert.academic_year && (
                              <span className="dot-tag tag-clip">ปี {cert.academic_year}</span>
                            )}
                            {cert.category && (
                              <span className={`dot-tag ${dotTagColor(cert.category)}`}>{cert.category}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
          </div>

          <div className="panel-header" style={{ marginTop: 24, marginBottom: 12 }}>
            <div>
              <p className="ws-eyebrow">กิจกรรมล่าสุด</p>
              <h3>การเปลี่ยนแปลงล่าสุด</h3>
            </div>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            {loading ? (
              <p style={{ color: "var(--ink-muted)", fontSize: 14, padding: 8 }}>กำลังโหลด...</p>
            ) : activities.length === 0 ? (
              <p style={{ color: "var(--ink-muted)", fontSize: 14, padding: 8 }}>ยังไม่มีกิจกรรม</p>
            ) : (
              activities.map((a) => (
                <div key={a.id} className="activity-row">
                  <ClockCounterClockwise weight="duotone" size={16} />
                  <span className="activity-action">
                    {a.action === "cert_created" && "เพิ่ม"}
                    {a.action === "cert_updated" && "แก้ไข"}
                    {a.action === "cert_deleted" && "ลบ"}
                    {a.target_type === "certificate" && " ประกาศนียบัตร"}
                    {(a.details as { title?: string })?.title && (
                      <>: {(a.details as { title: string }).title}</>
                    )}
                  </span>
                  <span className="activity-time">
                    {new Date(a.created_at).toLocaleDateString("th-TH", {
                      day: "numeric", month: "short",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="desk-actions" data-entrance-panel>
            <Link className="desk-action" href="/portfolio">
              <div className="desk-action-icon"><FolderOpen weight="duotone" /></div>
              <div className="desk-action-text">
                <strong>สร้างพอร์ตโฟลิโอ</strong>
                <span>รวมประกาศนียบัตรลงหน้าเดียว</span>
              </div>
              <ArrowRight weight="duotone" style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
            </Link>
            <Link className="desk-action" href="/profile">
              <div className="desk-action-icon"><User weight="duotone" /></div>
              <div className="desk-action-text">
                <strong>แก้ไขโปรไฟล์</strong>
                <span>ชื่อ โรงเรียน ทักษะ ประวัติ</span>
              </div>
              <ArrowRight weight="duotone" style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
            </Link>
            <Link className="desk-action" href="/certificates/new">
              <div className="desk-action-icon"><Certificate weight="duotone" /></div>
              <div className="desk-action-text">
                <strong>อัปโหลดประกาศนียบัตร</strong>
                <span>เพิ่มไฟล์รูปหรือเอกสาร</span>
              </div>
              <ArrowRight weight="duotone" style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
            </Link>

            <div className="desk-profile-status">
              <p className="ws-eyebrow">ข้อมูลส่วนตัว</p>
              <p style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.6, margin: "6px 0 0" }}>
                เก็บชื่อ โรงเรียน ประวัติ ทักษะ พร้อมสร้างพอร์ตโฟลิโอ
              </p>
              <div className="meter">
                <span className="meter-fill" style={{ width: `${profileCompletion}%` }} />
              </div>
              <span className="meter-label">{profileCompletion}% พร้อมสร้าง</span>
            </div>

            <div className="desk-profile-status">
              <p className="ws-eyebrow">ขั้นตอนถัดไป</p>
              <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
                <label className="task-check">
                  <input type="checkbox" defaultChecked={totalCertificates > 0} />
                  <span>อัปโหลดประกาศนียบัตร</span>
                </label>
                <label className="task-check">
                  <input type="checkbox" defaultChecked={profileCompletion >= 80} />
                  <span>กรอกโปรไฟล์ให้สมบูรณ์</span>
                </label>
                <label className="task-check">
                  <input type="checkbox" defaultChecked={portfolioCount > 0} />
                  <span>สร้างหน้าพอร์ตโฟลิโอ</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
