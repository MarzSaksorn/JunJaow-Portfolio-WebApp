"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import gsap from "gsap";
import { fileIcon, iconClass } from "@/lib/file-icons";
import type { Database } from "@/lib/supabase/types";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

const yearDotClasses: Record<string, string> = {
  "2569": "tab-clip",
  "2570": "tab-pink",
  "2571": "tab-mint",
  "2572": "tab-lavender",
};

const monthNamesTH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

export default function TimelinePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("owner_id", user.id)
        .not("issued_at", "is", null)
        .order("issued_at", { ascending: false });

      if (!cancelled) {
        setCertificates(data || []);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el || certificates.length === 0) return;
    const items = el.querySelectorAll<HTMLElement>(".tl-item");
    const dots = el.querySelectorAll<HTMLElement>(".tl-dot");
    if (!items.length) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(items, {
        y: 20,
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform",
      });
      if (dots.length) {
        gsap.from(dots, {
          scale: 0.3,
          opacity: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: "back.out(2)",
          clearProps: "transform",
        });
      }
    }, el);
    return () => mm.revert();
  }, [certificates.length]);

  useEntranceAnimation(rootRef);

  const grouped: Record<string, Certificate[]> = {};
  for (const cert of certificates) {
    if (!cert.issued_at) continue;
    const d = new Date(cert.issued_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(cert);
  }

  const sortedKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">เส้นเวลา</p>
          <h1>ความสำเร็จตามลำดับเวลา</h1>
        </div>
      </header>

      <div className="ws-body">
        {loading ? (
          <div className="tl-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="tl-sk-item">
                <div className="tl-sk-dot" />
                <div className="tl-sk-card">
                  <div className="skeleton-line w-50" />
                  <div className="skeleton-line w-80" />
                  <div className="skeleton-line w-30" />
                </div>
              </div>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="empty-state">
            <p>ยังไม่มีประกาศนียบัตรที่มีวันที่ออก</p>
            <span className="empty-state-hint">กำหนดวันที่ออกเมื่ออัปโหลดประกาศนียบัตร</span>
            <Link className="btn btn-primary" href="/certificates/new" style={{ marginTop: 4 }}>
              อัปโหลดประกาศนียบัตร
            </Link>
          </div>
        ) : (
          <div className="timeline" ref={timelineRef}>
            {sortedKeys.map((key) => {
              const [year, month] = key.split("-");
              const monthYear =
                monthNamesTH[parseInt(month) - 1] +
                " " +
                (parseInt(year) + 543);

              return (
                <div key={key} className="tl-group">
                  <div className="tl-month">
                    <span className="tl-month-label">{monthYear}</span>
                    <span className="tl-month-count">{grouped[key].length} รายการ</span>
                  </div>
                  {grouped[key].map((cert) => {
                    const isImage =
                      cert.file_type?.startsWith("image/") ||
                      /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i.test(
                        cert.file_url || ""
                      );
                    const d = cert.issued_at
                      ? new Date(cert.issued_at)
                      : null;
                    const dayStr = d
                      ? d.toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })
                      : "";
                    const dotColor =
                      yearDotClasses[cert.academic_year || ""] ||
                      "tab-clip";
                    return (
                      <div key={cert.id} className="tl-item">
                        <div className={`tl-dot ${dotColor}`} />
                        <Link
                          href={`/certificates/${cert.id}`}
                          className="tl-card"
                        >
                          <div className="tl-card-thumb">
                            {isImage && cert.file_url ? (
                              <img src={cert.file_url} alt="" loading="lazy" />
                            ) : (
                              <span className="tl-card-fallback">
                                {fileIcon(cert.file_type || "")}
                              </span>
                            )}
                          </div>
                          <div className="tl-card-body">
                            <div className="tl-card-head">
                              <h4>{cert.title}</h4>
                              <span className="tl-card-date">{dayStr}</span>
                            </div>
                            <p className="tl-card-issuer">
                              {cert.issuer || "—"}
                            </p>
                            <div className="tl-card-meta">
                              {cert.academic_year && (
                                <span
                                  className={`dot-tag ${
                                    yearDotClasses[cert.academic_year] ||
                                    "tab-clip"
                                  }`}
                                >
                                  ปี {cert.academic_year}
                                </span>
                              )}
                              {cert.category && (
                                <span className="dot-tag">{cert.category}</span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
