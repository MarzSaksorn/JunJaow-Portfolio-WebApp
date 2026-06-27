"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import gsap from "gsap";
import {
  FilePdf,
  Image,
  FileText,
  File,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import type { Database } from "@/lib/supabase/types";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

const yearDotClasses: Record<string, string> = {
  "2569": "tab-clip",
  "2570": "tab-pink",
  "2571": "tab-mint",
  "2572": "tab-lavender",
};

const dotTagColor = (cat: string | null) => {
  const colors = ["tag-clip", "tag-pink", "tag-mint", "tag-lavender"];
  if (!cat) return colors[0];
  let hash = 0;
  for (let i = 0; i < cat.length; i++) hash = ((hash << 5) - hash) + cat.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
};

const certIconClass = (type: string) => {
  const t = (type || "").toUpperCase();
  if (t.includes("PDF")) return "pdf";
  if (t.includes("IMAGE") || t.includes("PNG") || t.includes("JPG") || t.includes("JPEG")) return "image";
  if (t.includes("DOC") || t.includes("WORD")) return "doc";
  return "other";
};

const certIcon = (type: string) => {
  const t = (type || "").toUpperCase();
  if (t.includes("PDF")) return <FilePdf weight="duotone" />;
  if (t.includes("IMAGE") || t.includes("PNG") || t.includes("JPG") || t.includes("JPEG")) return <Image weight="duotone" />;
  if (t.includes("DOC") || t.includes("WORD")) return <FileText weight="duotone" />;
  return <File weight="duotone" />;
};

export function CertificateList() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const selectedYear = searchParams.get("year") || "";
  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("q") || "";

  const years = ["2569", "2570", "2571", "2572"];

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let dbQuery = supabase
      .from("certificates")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (searchQuery) {
      dbQuery = dbQuery.or(
        `title.ilike.%${searchQuery}%,issuer.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
      );
    }
    if (selectedYear) dbQuery = dbQuery.eq("academic_year", selectedYear);
    if (selectedCategory) dbQuery = dbQuery.eq("category", selectedCategory);

    const { data } = await dbQuery;
    setCertificates(data || []);
  }, [selectedYear, selectedCategory, searchQuery]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = [
    "วิชาการ", "กีฬา", "ศิลปะ", "ภาวะผู้นำ",
    "บริการ", "การแข่งขัน", "อบรม", "อื่นๆ",
  ];

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/certificates?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("q", query);
  }

  function clearFilters() {
    setQuery("");
    router.push("/certificates");
  }

  useEffect(() => {
    const el = rootRef.current;
    if (!el || certificates.length === 0) return;
    const cards = el.querySelectorAll<HTMLElement>(".cert-card");
    if (!cards.length) return;
    const dir = sessionStorage.getItem("nav-dir") === "up" ? -1 : 1;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(cards, { y: 20 * dir, autoAlpha: 0, duration: 0.3, stagger: 0.06, ease: "power2.out", clearProps: "transform" });
    }, el);
    return () => mm.revert();
  }, [certificates.length]);

  useEntranceAnimation(rootRef);

  return (
    <div className="archive-layout" ref={rootRef}>
      <aside className="filter-sidebar" data-entrance-filter>
        <h4>ปีการศึกษา</h4>
        {years.map((y) => (
          <button
            key={y}
            className={`filter-btn ${selectedYear === y ? "active" : ""}`}
            onClick={() => updateFilter("year", selectedYear === y ? "" : y)}
          >
            {y}
          </button>
        ))}

        <h4 style={{ marginTop: 16 }}>หมวดหมู่</h4>
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-btn ${selectedCategory === c ? "active" : ""}`}
            onClick={() => updateFilter("category", selectedCategory === c ? "" : c)}
          >
            {c}
          </button>
        ))}

        {(selectedYear || selectedCategory) && (
          <button className="filter-clear" onClick={clearFilters}>
            ล้างตัวกรอง
          </button>
        )}
      </aside>

      <div className="certificates-content">
        <form className="search-field" onSubmit={handleSearch}>
          <MagnifyingGlass weight="duotone" style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อ ผู้ออก หรือคำอธิบาย..."
          />
          <button className="btn btn-primary btn-sm" type="submit">ค้นหา</button>
        </form>

        <p className="result-count">
          {certificates.length} ประกาศนียบัตร
        </p>

        {certificates.length === 0 ? (
          <div className="empty-state">
            <p>ไม่พบประกาศนียบัตร</p>
            <Link className="btn btn-primary" href="/certificates/new">อัปโหลดประกาศนียบัตรอันแรก</Link>
          </div>
        ) : (
          <div className="cert-grid">
            {certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificates/${cert.id}`}
                className="cert-card"
              >
                <div className={`cert-card-tab ${yearDotClasses[cert.academic_year || ""] || "tab-clip"}`} />
                <div className="cert-card-body">
                  <div className={`cert-card-icon ${certIconClass(cert.file_type || "")}`}>
                    {certIcon(cert.file_type || "")}
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
                      {cert.tags?.slice(0, 2).map((tag) => (
                        <span className="dot-tag" key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
