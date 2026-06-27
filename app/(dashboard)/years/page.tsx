"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";

const yearDescriptions: Record<string, string> = {
  "2569": "ผลงานในปีการศึกษาแรก",
  "2570": "ความก้าวหน้าในปีที่สอง",
  "2571": "เสริมสร้างทักษะในปีที่สาม",
  "2572": "ผลงานในปีสุดท้าย",
};

export default function YearsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [yearCounts, setYearCounts] = useState<Record<string, number>>({});

  const years = ["2569", "2570", "2571", "2572"];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const counts: Record<string, number> = {};
      for (const year of years) {
        const { count } = await supabase
          .from("certificates")
          .select("*", { count: "exact", head: true })
          .eq("owner_id", user.id)
          .eq("academic_year", year);
        counts[year] = count || 0;
      }

      if (!cancelled) {
        setYearCounts(counts);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEntranceAnimation(rootRef);

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
          {years.map((year) => (
            <Link
              key={year}
              href={`/certificates?year=${year}`}
              className="year-card"
            >
              <div className="year-card-header">
                <span className="year-card-number">{year}</span>
                <span className="year-card-count">{yearCounts[year] || 0} รายการ</span>
              </div>
              <p>{yearDescriptions[year]}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
