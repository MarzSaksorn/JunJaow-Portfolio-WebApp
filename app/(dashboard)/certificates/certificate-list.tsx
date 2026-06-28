"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import { logActivity } from "@/lib/activity";
import { MagnifyingGlass, CheckSquare, SquaresFour, Trash, PencilLine, CalendarBlank, Tag, X, Check, CaretDown, DownloadSimple } from "@phosphor-icons/react";
import { fileIcon, iconClass } from "@/lib/file-icons";
import { TagInput } from "@/app/components/tag-input";
import JSZip from "jszip";
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

function TileContentWrapper({ href, batchMode, className, children }: { href: string; batchMode: boolean; className: string; children: React.ReactNode }) {
  if (batchMode) return <div className={className}>{children}</div>;
  return <Link href={href} className={className}>{children}</Link>;
}

export function CertificateList() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchAction, setBatchAction] = useState<"delete" | "year" | "tags" | null>(null);
  const [batchYear, setBatchYear] = useState("");
  const [batchTags, setBatchTags] = useState("");

  const selectedYear = searchParams.get("year") || "";
  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("q") || "";
  const dateFrom = searchParams.get("date_from") || "";
  const dateTo = searchParams.get("date_to") || "";
  const fileType = searchParams.get("file_type") || "";

  const years = ["2569", "2570", "2571", "2572"];

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

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
    if (dateFrom) dbQuery = dbQuery.gte("issued_at", dateFrom);
    if (dateTo) dbQuery = dbQuery.lte("issued_at", dateTo);
    if (fileType === "image") dbQuery = dbQuery.ilike("file_type", "image/%");
    else if (fileType === "pdf") dbQuery = dbQuery.ilike("file_type", "%pdf%");
    else if (fileType === "doc") dbQuery = dbQuery.or("file_type.ilike.%doc%,file_type.ilike.%word%,file_type.ilike.%document%");

    const { data } = await dbQuery;
    setCertificates(data || []);
    setLoading(false);
  }, [selectedYear, selectedCategory, searchQuery, dateFrom, dateTo, fileType]);

  useEffect(() => { load(); }, [load]);

  const categories = [
    "วิชาการ", "กีฬา", "ศิลปะ", "ภาวะผู้นำ",
    "บริการ", "การแข่งขัน", "อบรม", "อื่นๆ",
  ];

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
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

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === certificates.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(certificates.map((c) => c.id)));
    }
  }

  async function executeBatchDelete() {
    const supabase = createClient();
    const ids = Array.from(selectedIds);
    const toDelete = certificates.filter((c) => ids.includes(c.id));

    for (const cert of toDelete) {
      if (cert.file_path) {
        await supabase.storage.from("certificate-files").remove([cert.file_path]);
      }
    }

    const { error } = await supabase.from("certificates").delete().in("id", ids);
    if (!error) {
      ids.forEach((id) => {
        const cert = toDelete.find((c) => c.id === id);
        logActivity("cert_deleted", "certificate", id, { title: cert?.title });
      });
      setSelectedIds(new Set());
      setBatchAction(null);
      load();
    }
  }

  async function executeBatchYear() {
    if (!batchYear) return;
    const supabase = createClient();
    const ids = Array.from(selectedIds);
    await supabase.from("certificates").update({ academic_year: batchYear }).in("id", ids);
    setSelectedIds(new Set());
    setBatchAction(null);
    setBatchYear("");
    load();
  }

  async function downloadZip() {
    const ids = Array.from(selectedIds);
    const selected = certificates.filter((c) => ids.includes(c.id));
    if (selected.length === 0) return;

    const zip = new JSZip();
    for (const cert of selected) {
      if (!cert.file_url) continue;
      try {
        const res = await fetch(cert.file_url);
        const blob = await res.blob();
        const name = cert.file_name || `${cert.title}.${blob.type.split("/")[1] || "file"}`;
        zip.file(name, blob);
      } catch { /* skip failed */ }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificates-${new Date().toISOString().split("T")[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function executeBatchTags() {
    const supabase = createClient();
    const ids = Array.from(selectedIds);
    const certs = certificates.filter((c) => ids.includes(c.id));
    const allTags = new Set<string>();
    certs.forEach((c) => (c.tags as string[])?.forEach((t) => allTags.add(t)));
    const newTags = batchTags.split(",").map((t) => t.trim()).filter(Boolean);
    newTags.forEach((t) => allTags.add(t));
    const mergedTags = Array.from(allTags);
    await supabase.from("certificates").update({ tags: mergedTags }).in("id", ids);
    setSelectedIds(new Set());
    setBatchAction(null);
    setBatchTags("");
    load();
  }

  useEntranceAnimation(rootRef);

  const hasFilters = selectedYear || selectedCategory || searchQuery || dateFrom || dateTo || fileType;
  const isFiltered = hasFilters && !loading;
  const isEmpty = certificates.length === 0 && !loading;
  const isFresh = certificates.length === 0 && !loading && !hasFilters;

  return (
    <div className="archive-layout" ref={rootRef}>
      <aside className="filter-sidebar" data-entrance-filter>
        <div className="filter-section">
          <h4>ปีการศึกษา</h4>
          {years.map((y) => (
            <button
              key={y}
              className={`filter-btn${selectedYear === y ? " active" : ""}`}
              onClick={() => updateFilter("year", selectedYear === y ? "" : y)}
            >
              <span className={`filter-dot ${yearDotClasses[y] || "tab-clip"}`} />
              {y}
            </button>
          ))}
        </div>

        <div className="filter-section">
          <h4>หมวดหมู่</h4>
          <div className="filter-pills">
            {categories.map((c) => (
              <button
                key={c}
                className={`filter-pill${selectedCategory === c ? " active" : ""}`}
                onClick={() => updateFilter("category", selectedCategory === c ? "" : c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h4>ประเภทไฟล์</h4>
          {(["", "image", "pdf", "doc"] as const).map((ft) => (
            <button
              key={ft}
              className={`filter-btn${fileType === ft ? " active" : ""}`}
              onClick={() => updateFilter("file_type", fileType === ft ? "" : ft)}
            >
              {ft === "" ? "ทั้งหมด" : ft === "image" ? "รูปภาพ" : ft === "pdf" ? "PDF" : "เอกสาร"}
            </button>
          ))}
        </div>

        <div className="filter-section">
          <h4>ช่วงวันที่ออก</h4>
          <div className="filter-date-group">
            <label className="filter-date-label">
              จาก
              <input
                type="date"
                className="filter-date-input"
                value={dateFrom}
                onChange={(e) => updateFilter("date_from", e.target.value)}
              />
            </label>
            <label className="filter-date-label">
              ถึง
              <input
                type="date"
                className="filter-date-input"
                value={dateTo}
                onChange={(e) => updateFilter("date_to", e.target.value)}
              />
            </label>
          </div>
        </div>

        {hasFilters && (
          <button className="filter-clear" onClick={clearFilters}>
            ล้างตัวกรอง
          </button>
        )}
      </aside>

      <div className="certificates-content">
        <div className="cert-toolbar">
          <form className="search-field" onSubmit={handleSearch}>
            <MagnifyingGlass weight="duotone" style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อ ผู้ออก หรือคำอธิบาย..."
            />
            {query && (
              <button type="button" className="search-clear" onClick={() => { setQuery(""); router.push("/certificates"); }}>
                <X weight="duotone" size={14} />
              </button>
            )}
            <button className="btn btn-primary btn-sm" type="submit">ค้นหา</button>
          </form>
          <div className="cert-toolbar-actions">
            {hasFilters && (
              <button className="btn btn-sm btn-ghost" onClick={clearFilters}>
                <X weight="duotone" size={14} /> ล้างตัวกรอง
              </button>
            )}
            <button
              className={`btn btn-sm ${batchMode ? "btn-primary" : "btn-secondary"}`}
              onClick={() => { setBatchMode(!batchMode); setSelectedIds(new Set()); }}
            >
              <CheckSquare weight="duotone" size={16} />
              {batchMode ? "เลิกเลือก" : "เลือกหลายรายการ"}
            </button>
          </div>
        </div>

        {!loading && (
          <p className="result-count">
            {certificates.length === 0
              ? hasFilters ? "ไม่พบประกาศนียบัตรที่ตรงกับตัวกรอง" : "ยังไม่มีประกาศนียบัตร"
              : `${certificates.length} ประกาศนียบัตร`
            }
            {batchMode && selectedIds.size > 0 && ` — เลือก ${selectedIds.size} รายการ`}
          </p>
        )}

        {batchMode && selectedIds.size > 0 && (
          <div className="batch-bar">
            <span className="batch-bar-label">ดำเนินการกับ {selectedIds.size} รายการที่เลือก:</span>
            <div className="batch-bar-actions">
              <button className="btn btn-sm btn-secondary" onClick={selectAll}>
                <SquaresFour weight="duotone" size={14} />
                {selectedIds.size === certificates.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
              </button>
              <button className="btn btn-sm btn-secondary" onClick={() => setBatchAction("tags")}>
                <Tag weight="duotone" size={14} /> เพิ่มแท็ก
              </button>
              <button className="btn btn-sm btn-secondary" onClick={() => setBatchAction("year")}>
                <CalendarBlank weight="duotone" size={14} /> เปลี่ยนปี
              </button>
              <button className="btn btn-sm btn-secondary" onClick={downloadZip}>
                <DownloadSimple weight="duotone" size={14} /> ZIP
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => setBatchAction("delete")}>
                <Trash weight="duotone" size={14} /> ลบ
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="cert-tiles">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="cert-tile-skeleton">
                <div className="skeleton-thumb" />
                <div className="skeleton-tab" />
                <div className="skeleton-body">
                  <div className="skeleton-line w-70" />
                  <div className="skeleton-line w-40" />
                  <div className="skeleton-meta">
                    <div className="skeleton-chip" />
                    <div className="skeleton-chip" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          isFresh ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <span className="cert-tile-thumb-fallback" style={{ fontSize: 48, opacity: 0.3 }}>
                  {fileIcon("")}
                </span>
              </div>
              <p>ยังไม่มีประกาศนียบัตร</p>
              <span className="empty-state-hint">อัปโหลดไฟล์รูปภาพหรือเอกสารประกาศนียบัตรของคุณ</span>
              <Link className="btn btn-primary" href="/certificates/new" style={{ marginTop: 4 }}>อัปโหลดประกาศนียบัตรอันแรก</Link>
            </div>
          ) : (
            <div className="empty-state">
              <p>ไม่พบประกาศนียบัตรที่ตรงกับตัวกรอง</p>
              <span className="empty-state-hint">ลองเปลี่ยนปีการศึกษาหรือหมวดหมู่ที่เลือก</span>
              <button className="btn btn-secondary" onClick={clearFilters} style={{ marginTop: 4 }}>
                <X weight="duotone" /> ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )
        ) : (
          <div className="cert-tiles">
            {certificates.map((cert, i) => {
              const isImage = cert.file_type?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i.test(cert.file_url || "");
              return (
                <div
                  key={cert.id}
                  className={`cert-tile${batchMode ? " has-checkbox" : ""}${selectedIds.has(cert.id) ? " selected" : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                  onClick={batchMode ? () => toggleSelect(cert.id) : undefined}
                  role={batchMode ? "button" : undefined}
                  tabIndex={batchMode ? 0 : undefined}
                  onKeyDown={batchMode ? (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleSelect(cert.id); } } : undefined}
                >
                  {batchMode && (
                    <label className="cert-tile-check" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(cert.id)}
                        onChange={() => toggleSelect(cert.id)}
                      />
                    </label>
                  )}
                  <TileContentWrapper
                    href={`/certificates/${cert.id}`}
                    batchMode={batchMode}
                    className="cert-tile-link"
                  >
                    <div className={`cert-tile-thumb ${isImage ? "cert-tile-image" : ""} ${iconClass(cert.file_type || "")}`}>
                      {isImage && cert.file_url ? (
                        <img
                          src={cert.file_url}
                          alt={cert.title}
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hide");
                          }}
                        />
                      ) : null}
                      <span className={`cert-tile-thumb-fallback${(isImage && cert.file_url) ? " hide" : ""}`}>
                        {fileIcon(cert.file_type || "")}
                      </span>
                      {cert.file_type && (
                        <span className="cert-tile-type">
                          {cert.file_type.startsWith("image/") ? "รูปภาพ" :
                           cert.file_type.includes("pdf") ? "PDF" :
                           cert.file_type.includes("word") || cert.file_type.includes("document") ? "DOC" : "ไฟล์"}
                        </span>
                      )}
                    </div>
                    <div className={`cert-tile-tab ${yearDotClasses[cert.academic_year || ""] || "tab-clip"}`} />
                    <div className="cert-tile-body">
                      <h4>{cert.title}</h4>
                      <p>{cert.issuer || "—"}</p>
                      <div className="cert-tile-meta">
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
                  </TileContentWrapper>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {batchAction === "delete" && (
        <div className="modal-overlay" onClick={() => setBatchAction(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>ลบ {selectedIds.size} รายการ?</h3>
              <button className="modal-close" onClick={() => setBatchAction(null)}><X weight="duotone" /></button>
            </header>
            <p style={{ padding: "12px 24px", fontSize: 14, color: "var(--ink-muted)" }}>
              ไฟล์ที่แนบจะถูกลบออกด้วย การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setBatchAction(null)}>ยกเลิก</button>
              <button className="btn btn-danger" onClick={executeBatchDelete}>
                <Trash weight="duotone" /> ลบทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}

      {batchAction === "year" && (
        <div className="modal-overlay" onClick={() => setBatchAction(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>เปลี่ยนปีการศึกษา {selectedIds.size} รายการ</h3>
              <button className="modal-close" onClick={() => setBatchAction(null)}><X weight="duotone" /></button>
            </header>
            <div style={{ padding: "16px 24px" }}>
              <select value={batchYear} onChange={(e) => setBatchYear(e.target.value)} style={{ width: "100%" }}>
                <option value="">เลือกปี</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setBatchAction(null)}>ยกเลิก</button>
              <button className="btn btn-primary" disabled={!batchYear} onClick={executeBatchYear}>
                <Check weight="duotone" /> ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {batchAction === "tags" && (
        <div className="modal-overlay" onClick={() => setBatchAction(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>เพิ่มแท็กให้ {selectedIds.size} รายการ</h3>
              <button className="modal-close" onClick={() => setBatchAction(null)}><X weight="duotone" /></button>
            </header>
            <div style={{ padding: "16px 24px" }}>
              <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 8 }}>
                แท็กใหม่จะถูกเพิ่มเข้าไปในแท็กที่มีอยู่แล้วของแต่ละรายการ
              </p>
              <TagInput value={batchTags} onChange={setBatchTags} placeholder="พิมพ์แท็กเพื่อเพิ่ม..." />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setBatchAction(null)}>ยกเลิก</button>
              <button className="btn btn-primary" disabled={!batchTags.trim()} onClick={executeBatchTags}>
                <Check weight="duotone" /> เพิ่มแท็ก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
