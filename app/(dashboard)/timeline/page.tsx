"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { usePageEntrance } from "@/hooks/use-page-entrance";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

import { fileIcon, iconClass } from "@/lib/file-icons";
import type { Database } from "@/lib/supabase/types";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

const yearAccentClasses: Record<string, string> = {
  "2569": "accent-clip",
  "2570": "accent-pink",
  "2571": "accent-mint",
  "2572": "accent-lavender",
};

const monthNamesTH = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

export default function TimelinePage() {
  const rootRef = usePageEntrance<HTMLDivElement>();
  const scrollRef = useScrollReveal<HTMLDivElement>();
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
      <header className="ws-header" data-animate="fade-up" data-order="1">
        <div>
          <p className="ws-eyebrow">เส้นเวลา</p>
          <h1>ลำดับความสำเร็จ</h1>
        </div>
      </header>

      <div className="ws-body">
        {loading ? (
          <div className="tm-skeleton">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="tm-sk-month">
                <div className="tm-sk-divider" />
                <div className="tm-sk-entry">
                  <div className="tm-sk-accent" />
                  <div className="tm-sk-thumb" />
                  <div className="tm-sk-lines">
                    <div className="skeleton-line w-60" />
                    <div className="skeleton-line w-40" />
                    <div className="skeleton-line w-20" />
                  </div>
                </div>
                <div className="tm-sk-entry">
                  <div className="tm-sk-accent" />
                  <div className="tm-sk-thumb" />
                  <div className="tm-sk-lines">
                    <div className="skeleton-line w-50" />
                    <div className="skeleton-line w-30" />
                    <div className="skeleton-line w-25" />
                  </div>
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
          <div className="tm-feed" ref={scrollRef}>
            {sortedKeys.map((key) => {
              const [year, month] = key.split("-");
              const monthYear =
                monthNamesTH[parseInt(month) - 1] +
                " " +
                (parseInt(year) + 543);

              return (
                <div key={key} className="tm-month" data-scroll="fade-up">
                  <div className="tm-divider">
                    <span>{monthYear}</span>
                    <span className="tm-divider-count">{grouped[key].length} รายการ</span>
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
                    const accentClass =
                      yearAccentClasses[cert.academic_year || ""] ||
                      "accent-clip";
                    return (
                      <Link
                        key={cert.id}
                        href={`/certificates/${cert.id}`}
                        className={`tm-entry ${accentClass}`}
                        data-animate-stagger
                      >
                        <div className="tm-entry-accent" />
                        <div className="tm-entry-thumb">
                          {isImage && cert.file_url ? (
                            <img src={cert.file_url} alt="" loading="lazy" />
                          ) : (
                            <span className="tm-entry-fallback">
                              {fileIcon(cert.file_type || "")}
                            </span>
                          )}
                        </div>
                        <div className="tm-entry-body">
                          <div className="tm-entry-head">
                            <h4>{cert.title}</h4>
                            <span className="tm-entry-date">{dayStr}</span>
                          </div>
                          <p className="tm-entry-issuer">
                            {cert.issuer || "—"}
                          </p>
                          <div className="tm-entry-tags">
                            {cert.academic_year && (
                              <span className="dot-tag tag-clip">
                                ปี {cert.academic_year}
                              </span>
                            )}
                            {cert.category && (
                              <span className="dot-tag">{cert.category}</span>
                            )}
                          </div>
                        </div>
                      </Link>
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
