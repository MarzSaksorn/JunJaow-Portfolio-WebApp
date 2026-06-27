"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import { fileIcon, iconClass } from "@/lib/file-icons";

const yearDescriptions: Record<string, string> = {
  "2569": "ผลงานในปีการศึกษาแรก",
  "2570": "ความก้าวหน้าในปีที่สอง",
  "2571": "เสริมสร้างทักษะในปีที่สาม",
  "2572": "ผลงานในปีสุดท้าย",
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
          .limit(2);

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
                <div className="year-sk-line w-40" />
                <div className="year-sk-line w-70" />
              </div>
            ))
          ) : (
            years.map((year) => {
              const d = yearData[year];
              const count = d?.count || 0;
              const previews = d?.previews || [];

            return (
              <Link
                key={year}
                href={`/certificates?year=${year}`}
                className="year-card"
              >
                {previews.length > 0 && (
                  <div className="year-previews">
                    {previews.map((p, i) => (
                      <div key={i} className={`year-thumb ${isImageUrl(p.url, p.type) ? "" : `icon ${iconClass(p.type)}`}`}>
                        {isImageUrl(p.url, p.type) ? (
                          <img src={p.url} alt="" loading="lazy" />
                        ) : (
                          <span className="year-thumb-fallback">{fileIcon(p.type)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="year-card-header">
                  <span className="year-card-number">{year}</span>
                  <span className="year-card-count">{count} รายการ</span>
                </div>
                <p>{yearDescriptions[year]}</p>
              </Link>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
