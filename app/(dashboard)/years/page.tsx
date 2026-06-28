"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import { fileIcon, iconClass } from "@/lib/file-icons";
import { FolderOpen } from "@phosphor-icons/react";

const yearMeta: Record<string, { desc: string; accent: string }> = {
  "2569": { desc: "ผลงานในปีการศึกษาแรก", accent: "year-accent-clip" },
  "2570": { desc: "ความก้าวหน้าในปีที่สอง", accent: "year-accent-pink" },
  "2571": { desc: "เสริมสร้างทักษะในปีที่สาม", accent: "year-accent-mint" },
  "2572": { desc: "ผลงานในปีสุดท้าย", accent: "year-accent-lavender" },
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
        <div className="years-grid" data-entrance>
          {loading ? (
            years.map((year) => (
              <div key={year} className="year-card-skeleton">
                <div className="year-sk-thumb" />
                <div className="year-sk-body">
                  <div className="year-sk-line w-40" />
                  <div className="year-sk-line w-70" />
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
                className={`year-card ${accent}`}
              >
                <div className="year-card-inner">
                  <div className="year-previews">
                    {previews.length > 0 ? (
                      [0, 1, 2, 3].map((i) => {
                        const p = previews[i];
                        return p ? (
                          <div key={i} className={`year-thumb ${isImageUrl(p.url, p.type) ? "" : `icon ${iconClass(p.type)}`}`}>
                            {isImageUrl(p.url, p.type) ? (
                              <img src={p.url} alt="" loading="lazy" />
                            ) : (
                              <span className="year-thumb-fallback">{fileIcon(p.type)}</span>
                            )}
                          </div>
                        ) : (
                          <div key={i} className="year-thumb year-thumb-empty">
                            {i === 0 && <FolderOpen weight="duotone" size={24} />}
                          </div>
                        );
                      })
                    ) : (
                      <div className="year-thumb year-thumb-empty year-thumb-full">
                        <FolderOpen weight="duotone" size={32} />
                      </div>
                    )}
                  </div>
                  <div className="year-card-header">
                    <span className="year-card-number">{year}</span>
                    <span className="year-card-count">{count} รายการ</span>
                  </div>
                  <p>{meta?.desc || ""}</p>
                </div>
              </Link>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
