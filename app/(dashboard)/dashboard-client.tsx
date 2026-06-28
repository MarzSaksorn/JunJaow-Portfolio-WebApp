"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import gsap from "gsap";
import {
  Certificate,
  FolderOpen,
  User,
  ArrowRight,
  ClockCounterClockwise,
  CheckCircle,
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
    const blocks = el.querySelectorAll<HTMLElement>(".ds-year");
    if (!blocks.length) return;
    const dir = sessionStorage.getItem("nav-dir") === "up" ? -1 : 1;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(blocks,
        {
          y: 40 * dir,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
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
          <h1>ห้องรับรอง<br />ผลงานของคุณ</h1>
        </div>
        <div className="ws-header-actions">
          <Link className="btn btn-secondary" href="/certificates">เรียกดูคลัง</Link>
          <Link className="btn btn-primary" href="/certificates/new">อัปโหลดไฟล์</Link>
        </div>
      </header>

      <div className="ws-body">
        <div className="ds-stats">
          <div className="ds-stat ds-stat-clip">
            <div className="ds-stat-body">
              <strong>{totalCertificates}</strong>
              <span>ทั้งหมด</span>
              <small>+{recentCount} เดือนนี้</small>
            </div>
          </div>
          <div className="ds-stat ds-stat-pink">
            <div className="ds-stat-body">
              <strong>{portfolioCount}</strong>
              <span>พอร์ตโฟลิโอ</span>
            </div>
          </div>
          <div className="ds-stat ds-stat-mint">
            <div className="ds-stat-body">
              <strong>{Object.keys(yearCounts).length}</strong>
              <span>ปีการศึกษา</span>
            </div>
          </div>
          <div className="ds-stat ds-stat-lavender">
            <div className="ds-stat-body">
              <strong>{profileCompletion}%</strong>
              <span>โปรไฟล์พร้อม</span>
            </div>
          </div>
        </div>

        <div className="ds-years">
          {years.map((year) => {
            const count = yearCounts[year] || 0;
            const maxCount = Math.max(...Object.values(yearCounts), 1);
            const barPct = (count / maxCount) * 100;
            return (
              <Link
                key={year}
                href={`/certificates?year=${year}`}
                className={`ds-year ${yearBorderClasses[year]}`}
              >
                <span className="ds-year-bar" style={{ width: `${barPct}%` }} />
                <span className="ds-year-num">{year}</span>
                <span className="ds-year-count">{count} รายการ</span>
              </Link>
            );
          })}
        </div>

        <div className="ds-main">
          <section className="ds-sheet">
            <div className="ds-sheet-head">
              <h2>ประกาศนียบัตรล่าสุด</h2>
              <Link className="btn btn-sm btn-secondary" href="/certificates">ดูทั้งหมด</Link>
            </div>
            <div className="ds-sheet-body">
              {recentCerts.length === 0 ? (
                <div className="empty-state" style={{ padding: "24px 16px" }}>
                  <p>ยังไม่มีประกาศนียบัตร</p>
                  <Link className="btn btn-primary" href="/certificates/new">อัปโหลดอันแรก</Link>
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

            <div className="ds-feed">
              <h3 className="ds-feed-head">กิจกรรมล่าสุด</h3>
              <div className="ds-feed-list">
                {loading ? (
                  <p style={{ color: "var(--ink-muted)", fontSize: 14, padding: "4px 0" }}>กำลังโหลด...</p>
                ) : activities.length === 0 ? (
                  <p style={{ color: "var(--ink-muted)", fontSize: 14, padding: "4px 0" }}>ยังไม่มีกิจกรรม</p>
                ) : (
                  activities.slice(0, 5).map((a) => (
                    <div key={a.id} className="ds-feed-item">
                      <ClockCounterClockwise weight="duotone" size={13} />
                      <span>
                        {a.action === "cert_created" && "เพิ่ม"}
                        {a.action === "cert_updated" && "แก้ไข"}
                        {a.action === "cert_deleted" && "ลบ"}
                        {a.target_type === "certificate" && " ประกาศนียบัตร"}
                        {(a.details as { title?: string })?.title && (
                          <>: {(a.details as { title: string }).title}</>
                        )}
                      </span>
                      <span className="ds-feed-time">
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
          </section>

          <aside className="ds-flap">
            <div className="ds-flap-profile">
              <div className="ds-flap-accent" />
              <p className="ws-eyebrow">ข้อมูลส่วนตัว</p>
              <p className="ds-flap-desc">เก็บชื่อ โรงเรียน ประวัติ ทักษะ พร้อมสร้างพอร์ตโฟลิโอ</p>
              <div className="meter">
                <span className="meter-fill" style={{ width: `${profileCompletion}%` }} />
              </div>
              <span className="meter-label">{profileCompletion}% พร้อมสร้าง</span>
            </div>

            <div className="ds-flap-section">
              <p className="ws-eyebrow">ขั้นตอนถัดไป</p>
              <div className="ds-flap-tasks">
                <label className="task-check task-check-done">
                  <CheckCircle weight={totalCertificates > 0 ? "fill" : "regular"} size={16} />
                  <span>อัปโหลดประกาศนียบัตร</span>
                </label>
                <label className="task-check task-check-done">
                  <CheckCircle weight={profileCompletion >= 80 ? "fill" : "regular"} size={16} />
                  <span>กรอกโปรไฟล์ให้สมบูรณ์</span>
                </label>
                <label className="task-check task-check-done">
                  <CheckCircle weight={portfolioCount > 0 ? "fill" : "regular"} size={16} />
                  <span>สร้างหน้าพอร์ตโฟลิโอ</span>
                </label>
              </div>
            </div>

            <div className="ds-flap-actions">
              <Link className="ds-flap-btn" href="/portfolio">
                <FolderOpen weight="duotone" size={16} />
                <span>สร้างพอร์ตโฟลิโอ</span>
                <ArrowRight weight="duotone" size={14} />
              </Link>
              <Link className="ds-flap-btn" href="/profile">
                <User weight="duotone" size={16} />
                <span>แก้ไขโปรไฟล์</span>
                <ArrowRight weight="duotone" size={14} />
              </Link>
              <Link className="ds-flap-btn" href="/certificates/new">
                <Certificate weight="duotone" size={16} />
                <span>อัปโหลดประกาศนียบัตร</span>
                <ArrowRight weight="duotone" size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
