"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import { MagnifyingGlass, ListDashes, CheckCircle, Trash, FilePdf } from "@phosphor-icons/react";
import { TEMPLATES } from "@/app/components/portfolio-templates";
import type { TemplateType } from "@/app/components/portfolio-templates";
import type { Database } from "@/lib/supabase/types";
import { ConfirmDialog } from "@/app/components/confirm-dialog";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type PortfolioPage = Database["public"]["Tables"]["portfolio_pages"]["Row"];

export function PortfolioGenerator() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [portfolioPages, setPortfolioPages] = useState<PortfolioPage[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [certSearch, setCertSearch] = useState("");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [showDeletePage, setShowDeletePage] = useState<PortfolioPage | null>(null);
  const [showPdfError, setShowPdfError] = useState(false);
  const [sections, setSections] = useState({
    skills: true,
    activities: true,
    contact: true,
    bio: true,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;

      const [profileRes, certsRes, pagesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("owner_id", user.id).single(),
        supabase.from("certificates").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
        supabase.from("portfolio_pages").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (cancelled) return;

      setProfile(profileRes.data as Profile | null);
      setCertificates(certsRes.data || []);
      setPortfolioPages(pagesRes.data || []);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const sortedSelected = selectedIds
    .map((id) => certificates.find((c) => c.id === id))
    .filter(Boolean) as Certificate[];

  function toggleCert(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function moveCert(fromIdx: number, toIdx: number) {
    const ids = [...selectedIds];
    const [moved] = ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, moved);
    setSelectedIds(ids);
  }

  function handleDragStart(idx: number) {
    setDragIdx(idx);
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    moveCert(dragIdx, idx);
    setDragIdx(idx);
  }

  function handleDragEnd() {
    setDragIdx(null);
  }

  const filteredCerts = certSearch
    ? certificates.filter(
        (c) =>
          c.title.toLowerCase().includes(certSearch.toLowerCase()) ||
          c.issuer?.toLowerCase().includes(certSearch.toLowerCase()),
      )
    : certificates;

  async function generatePortfolio() {
    if (!title.trim()) { setError("ตั้งชื่อพอร์ตโฟลิโอ"); return; }
    if (selectedIds.length === 0) { setError("เลือกประกาศนียบัตรอย่างน้อย 1 รายการ"); return; }
    setError("");
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("ไม่ได้เข้าสู่ระบบ"); setSaving(false); return; }

    const selectedCerts = sortedSelected;

    const contentSnapshot = {
      profile: profile
        ? {
            full_name: profile.full_name,
            nickname: profile.nickname,
            school: profile.school,
            program: profile.program,
            bio: profile.bio,
            skills: profile.skills,
            activities: profile.activities,
            contact: profile.contact,
            profile_image_url: profile.profile_image_url,
          }
        : null,
      certificates: selectedCerts.map((c) => ({
        title: c.title,
        issuer: c.issuer,
        description: c.description,
        academic_year: c.academic_year,
        category: c.category,
        tags: c.tags,
        file_url: c.file_url,
        file_type: c.file_type,
        issued_at: c.issued_at,
      })),
      generated_at: new Date().toISOString(),
      template: template,
      sections: sections,
    };

    const { error: insertError } = await supabase.from("portfolio_pages").insert({
      owner_id: user.id,
      title: title.trim(),
      selected_certificate_ids: selectedIds,
      content_snapshot: contentSnapshot as any,
    });

    if (insertError) { setError(insertError.message); setSaving(false); return; }

    setSaving(false);
    setSaved(true);
    setTitle("");
    setSelectedIds([]);

    // reload pages
    const { data: freshPages } = await supabase
      .from("portfolio_pages").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
    if (freshPages) setPortfolioPages(freshPages);
  }

  async function handleDeletePage() {
    if (!showDeletePage) return;
    const supabase = createClient();
    await supabase.from("portfolio_pages").delete().eq("id", showDeletePage.id);
    setPortfolioPages((prev) => prev.filter((p) => p.id !== showDeletePage.id));
    setShowDeletePage(null);
  }

  useEntranceAnimation(rootRef);

  const completionPercent = profile
    ? [profile.full_name, profile.school, profile.bio, profile.skills?.length, profile.activities?.length]
        .filter(Boolean).length * 20
    : 0;

  return (
    <div ref={rootRef}>
      <div className="portfolio-setup">
        <div className="panel" data-entrance-panel>
          <p className="ws-eyebrow">ความพร้อมของโปรไฟล์</p>
          <div className="meter" style={{ marginTop: 12 }}>
            <span className="meter-fill" style={{ width: `${completionPercent}%` }} />
          </div>
          <span className="meter-label">{completionPercent}% พร้อม</span>
          {(!profile || !profile.full_name) && (
            <Link className="btn btn-secondary btn-full" href="/profile" style={{ marginTop: 12 }}>
              กรอกโปรไฟล์ก่อน
            </Link>
          )}
        </div>

        <div className="panel" data-entrance-panel>
          <p className="ws-eyebrow">สร้าง</p>
          <h3 style={{ margin: 0 }}>พอร์ตโฟลิโอใหม่</h3>

          <div className="form-field" style={{ marginTop: 12 }}>
            <label>ชื่อพอร์ตโฟลิโอ</label>
            <input
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น พอร์ต Admission 2572"
            />
          </div>

          <div className="form-field" style={{ marginTop: 12 }}>
            <label>แม่แบบ</label>
            <div className="template-selector">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  className={`template-card${template === t.id ? " active" : ""}`}
                  onClick={() => setTemplate(t.id)}
                  type="button"
                >
                  <div className="template-card-preview">
                    <div className={`template-card-icon template-icon-${t.id}`} />
                  </div>
                  <div className="template-card-body">
                    <strong>{t.name}</strong>
                    <p>{t.desc}</p>
                  </div>
                  {template === t.id && (
                    <span className="template-check">
                      <CheckCircle weight="fill" size={16} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field" style={{ marginTop: 12 }}>
            <label>ส่วนที่แสดง</label>
            <div className="section-toggles">
              {(["skills", "activities", "contact", "bio"] as const).map((s) => (
                <label key={s} className="task-check">
                  <input
                    type="checkbox"
                    checked={sections[s]}
                    onChange={() => setSections((prev) => ({ ...prev, [s]: !prev[s] }))}
                  />
                  <span>{s === "skills" ? "ทักษะ" : s === "activities" ? "กิจกรรม" : s === "contact" ? "ช่องทางติดต่อ" : "ประวัติ"}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="form-error" style={{ marginTop: 8 }}>{error}</p>}

          <div className="form-field" style={{ marginTop: 8 }}>
            <label>ค้นหาประกาศนียบัตร</label>
            <div className="search-field" style={{ marginTop: 4 }}>
              <MagnifyingGlass weight="duotone" size={16} style={{ color: "var(--ink-faint)", flexShrink: 0 }} />
              <input
                type="text"
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                placeholder="พิมพ์ชื่อหรือผู้ออก..."
                style={{ border: "none", background: "transparent", flex: 1, outline: "none", fontSize: 13 }}
              />
            </div>
          </div>

          <div className="cert-checklist" data-entrance>
            {filteredCerts.length === 0 && (
              <p style={{ color: "var(--ink-muted)", fontSize: 13 }}>
                {certSearch ? "ไม่พบประกาศนียบัตรที่ค้นหา" : "ยังไม่มีประกาศนียบัตร"}
              </p>
            )}
            {filteredCerts.map((cert) => {
              const isSelected = selectedIds.includes(cert.id);
              const sortIdx = selectedIds.indexOf(cert.id);
              return (
                <label
                  key={cert.id}
                  className={`cert-check${isSelected ? " selected" : ""}`}
                  draggable={isSelected}
                  onDragStart={() => isSelected && handleDragStart(sortIdx)}
                  onDragOver={(e) => isSelected && handleDragOver(e, sortIdx)}
                  onDragEnd={handleDragEnd}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCert(cert.id)}
                  />
                  {isSelected && (
                    <span className="cert-check-grip" title="ลากเพื่อเรียงลำดับ">
                      <ListDashes weight="duotone" size={14} />
                    </span>
                  )}
                  <div>
                    <strong>{cert.title}</strong>
                    <p>{cert.issuer}</p>
                  </div>
                  {isSelected && (
                    <span className="cert-check-order">{sortIdx + 1}</span>
                  )}
                </label>
              );
            })}
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={generatePortfolio}
            disabled={saving}
            style={{ marginTop: 12 }}
          >
            {saving ? "กำลังสร้าง..." : "สร้างหน้าพอร์ตโฟลิโอ"}
          </button>

          {saved && (
            <p className="form-success" style={{ marginTop: 8 }}>
              <CheckCircle weight="fill" size={14} /> สร้างพอร์ตโฟลิโอสำเร็จ
            </p>
          )}
        </div>
      </div>

      {portfolioPages.length > 0 && (
        <div className="portfolio-list" data-entrance>
          <h3>พอร์ตโฟลิโอที่บันทึกแล้ว</h3>
          <div className="portfolio-list-scroll">
          {portfolioPages.map((page) => (
            <div className="panel" key={page.id}>
              <div className="portfolio-list-head">
                <Link href={`/portfolio/${page.id}`} className="portfolio-list-link">
                  <h4 style={{ margin: 0 }}>{page.title}</h4>
                  <p style={{ margin: "4px 0", color: "var(--ink-muted)", fontSize: 13 }}>
                    {page.selected_certificate_ids?.length || 0} รายการ
                    {(() => {
                      const snap = page.content_snapshot as any;
                      const t = snap?.template || "modern";
                      return <> · {TEMPLATES.find((x) => x.id === t)?.name || t}</>;
                    })()}
                  </p>
                  <p style={{ margin: 0, color: "var(--ink-faint)", fontSize: 12 }}>
                    สร้างเมื่อ {new Date(page.created_at || "").toLocaleDateString()}
                  </p>
                </Link>
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ flexShrink: 0 }}
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/portfolio/export", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ portfolioId: page.id }),
                      });
                      if (!res.ok) throw new Error();
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `portfolio-${page.id}.pdf`;
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch {
                      setShowPdfError(true);
                    }
                  }}
                  aria-label="ดาวน์โหลด PDF"
                >
                  <FilePdf weight="duotone" size={14} />
                </button>
                <button
                  className="btn btn-sm btn-ghost"
                  style={{ color: "var(--ink-faint)", flexShrink: 0 }}
                  onClick={() => setShowDeletePage(page)}
                  aria-label="ลบ"
                >
                  <Trash weight="duotone" size={14} />
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!showDeletePage}
        title="ลบพอร์ตโฟลิโอ"
        message={`แน่ใจว่าต้องการลบ "${showDeletePage?.title}"?`}
        confirmLabel="ลบ"
        danger
        onConfirm={handleDeletePage}
        onCancel={() => setShowDeletePage(null)}
      />

      <ConfirmDialog
        open={showPdfError}
        title="เกิดข้อผิดพลาด"
        message="ไม่สามารถสร้าง PDF ได้ กรุณาลองอีกครั้ง"
        confirmLabel="ตกลง"
        onConfirm={() => setShowPdfError(false)}
        onCancel={() => setShowPdfError(false)}
      />
    </div>
  );
}
