"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import { fileIcon, iconClass } from "@/lib/file-icons";
import { FolderOpen, ArrowRight } from "@phosphor-icons/react";

const yearMeta: Record<string, { desc: string; accent: string }> = {
  "2569": { desc: "ผลงานในปีการศึกษาแรก", accent: "ya-clip" },
  "2570": { desc: "ความก้าวหน้าในปีที่สอง", accent: "ya-pink" },
  "2571": { desc: "เสริมสร้างทักษะในปีที่สาม", accent: "ya-mint" },
  "2572": { desc: "ผลงานในปีสุดท้าย", accent: "ya-lavender" },
};

type YearPreview = {
  count: number;
  previews: { url: string; type: string }[];
};

export default function YearsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [yearData, setYearData] = useState<Record<string, YearPreview>>({});
  const [loading, setLoading] = useState(true);

  const years = ["2569", "2570", "2571", "2572"];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const data: Record<string, YearPreview> = {};
      for (const year of years) {
        const { data: certs } = await supabase
          .from("certificates")
          .select("file_url, file_type", { count: "exact" })
          .eq("owner_id", user.id)
          .eq("academic_year", year)
          .limit(4);

        data[year] = {
          count: certs?.length || 0,
          previews: (certs || []).map((c) => ({
            url: c.file_url || "",
            type: c.file_type || "",
          })),
        };
      }

      if (!cancelled) { setYearData(data); setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEntranceAnimation(rootRef);

  function isImageUrl(url: string, type: string) {
    return type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i.test(url);
  }

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">ปีการศึกษา</p>
          <h1>คลังปีการศึกษาไทย</h1>
        </div>
      </header>

      <div className="ws-body">
        <div className="ya-grid" data-entrance>
          {loading ? (
            years.map((year) => (
              <div key={year} className="ya-skeleton">
                <div className="ya-sk-head" />
                <div className="ya-sk-body">
                  <div className="ya-sk-grid">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="ya-sk-cell" />
                    ))}
                  </div>
                  <div className="ya-sk-line" />
                </div>
              </div>
            ))
          ) : (
            years.map((year) => {
              const d = yearData[year];
              const count = d?.count || 0;
              const previews = d?.previews || [];
              const meta = yearMeta[year];
              const accent = meta?.accent || "";

            return (
              <Link
                key={year}
                href={`/certificates?year=${year}`}
                className={`ya-card ${accent}`}
              >
                <div className={`ya-head ${accent}`}>
                  <strong>{year}</strong>
                  <span className="ya-head-count">{count}</span>
                  <div className="ya-head-bar" />
                </div>
                <div className="ya-body">
                  <div className="ya-previews">
                    {previews.length > 0 ? (
                      [0, 1, 2, 3].map((i) => {
                        const p = previews[i];
                        return p ? (
                          <div key={i} className="ya-thumb">
                            {isImageUrl(p.url, p.type) ? (
                              <img src={p.url} alt="" loading="lazy" />
                            ) : (
                              <span className="ya-thumb-fallback">{fileIcon(p.type)}</span>
                            )}
                          </div>
                        ) : (
                          <div key={i} className="ya-thumb ya-thumb-empty" />
                        );
                      })
                    ) : (
                      <>
                        <div className="ya-thumb ya-thumb-empty" />
                        <div className="ya-thumb ya-thumb-empty" />
                        <div className="ya-thumb ya-thumb-empty" />
                        <div className="ya-thumb ya-thumb-empty" />
                      </>
                    )}
                  </div>
                  <div className="ya-footer">
                    <span>{meta?.desc || ""}</span>
                    <ArrowRight weight="duotone" size={14} />
                  </div>
                </div>
              </Link>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
