"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { usePageEntrance } from "@/hooks/use-page-entrance";

import { MagnifyingGlass, ListDashes, CheckCircle, Trash, FilePdf, GearSix, ArrowRight, CaretDown, CaretUp } from "@phosphor-icons/react";
import { TEMPLATES } from "@/app/components/portfolio-templates";
import type { TemplateType } from "@/app/components/portfolio-templates";
import type { Database } from "@/lib/supabase/types";
import { ConfirmDialog } from "@/app/components/confirm-dialog";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type PortfolioPage = Database["public"]["Tables"]["portfolio_pages"]["Row"];

export function PortfolioGenerator() {
  const rootRef = usePageEntrance<HTMLDivElement>();
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
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  function handleDragStart(idx: number) { setDragIdx(idx); }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    moveCert(dragIdx, idx);
    setDragIdx(idx);
  }

  function handleDragEnd() { setDragIdx(null); }

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

  const completionPct = profile
    ? [profile.full_name, profile.school, profile.bio, profile.skills?.length, profile.activities?.length]
        .filter(Boolean).length * 20
    : 0;

  return (
    <div ref={rootRef}>
      <div className="pw-layout">
        <div className="pw-main" data-animate="fade-up" data-order="1">
          <div className="pw-field">
            <label className="pw-label">ตั้งชื่อพอร์ตโฟลิโอ</label>
            <input
              className="pw-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น พอร์ต Admission 2572"
            />
          </div>

          <button
            className="pw-advanced-toggle"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <GearSix weight="duotone" size={14} />
            ตั้งค่าเพิ่มเติม
            <CaretDown
              weight="duotone"
              size={12}
              style={{
                transform: showAdvanced ? "rotate(180deg)" : undefined,
                transition: "transform var(--duration-fast) var(--ease-out)",
              }}
            />
          </button>

          {showAdvanced && (
            <>
              <div className="pw-field">
                <label className="pw-label">แม่แบบ</label>
                <div className="pw-templates">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      className={`pw-template${template === t.id ? " active" : ""}`}
                      onClick={() => setTemplate(t.id)}
                      type="button"
                    >
                      <div className={`pw-template-icon template-icon-${t.id}`} />
                      <div className="pw-template-body">
                        <strong>{t.name}</strong>
                        <p>{t.desc}</p>
                      </div>
                      {template === t.id && (
                        <CheckCircle weight="fill" size={16} className="pw-template-check" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pw-field">
                <label className="pw-label">ส่วนที่แสดง</label>
                <div className="pw-toggles">
                  {(["skills", "activities", "contact", "bio"] as const).map((s) => (
                    <label key={s} className="pw-toggle">
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
            </>
          )}

          <div className="pw-field">
            <label className="pw-label">เลือกประกาศนียบัตร</label>
            <div className="pw-search">
              <MagnifyingGlass weight="duotone" size={15} />
              <input
                type="text"
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                placeholder="พิมพ์ชื่อหรือผู้ออก..."
              />
            </div>
            <div className="pw-certs">
              {filteredCerts.length === 0 && (
                <p className="ink-muted fz-13 py-8">
                  {certSearch ? "ไม่พบประกาศนียบัตรที่ค้นหา" : "ยังไม่มีประกาศนียบัตร"}
                </p>
              )}
              {filteredCerts.map((cert) => {
                const isSelected = selectedIds.includes(cert.id);
                const sortIdx = selectedIds.indexOf(cert.id);
                return (
                  <label
                    key={cert.id}
                    className={`pw-cert${isSelected ? " selected" : ""}`}
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
                      <span className="pw-cert-grip" title="ลากเพื่อเรียงลำดับ">
                        <ListDashes weight="duotone" size={13} />
                      </span>
                    )}
                    <div className="pw-cert-info">
                      <strong>{cert.title}</strong>
                      <p>{cert.issuer}</p>
                    </div>
                    {isSelected && (
                      <>
                        <button
                          type="button"
                          className="pw-cert-move"
                          disabled={sortIdx === 0}
                          onClick={(e) => { e.preventDefault(); moveCert(sortIdx, sortIdx - 1); }}
                          aria-label="เลื่อนขึ้น"
                        >
                          <CaretUp weight="duotone" size={12} />
                        </button>
                        <button
                          type="button"
                          className="pw-cert-move"
                          disabled={sortIdx === selectedIds.length - 1}
                          onClick={(e) => { e.preventDefault(); moveCert(sortIdx, sortIdx + 1); }}
                          aria-label="เลื่อนลง"
                        >
                          <CaretDown weight="duotone" size={12} />
                        </button>
                        <span className="pw-cert-num">{sortIdx + 1}</span>
                      </>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}
          {saved && (
            <p className="form-success">
              <CheckCircle weight="fill" size={14} /> สร้างพอร์ตโฟลิโอสำเร็จ
            </p>
          )}

          <button
            className="btn btn-primary btn-full"
            onClick={generatePortfolio}
            disabled={saving}
          >
            {saving ? "กำลังสร้าง..." : "สร้างหน้าพอร์ตโฟลิโอ"}
          </button>
        </div>

        <aside className="pw-side" data-animate="fade-up" data-order="2">
          <div className="pw-meter">
            <div className="pw-meter-accent" />
            <p className="ws-eyebrow">ความพร้อม</p>
            <div className="meter mt-10">
              <span className="meter-fill" style={{ width: `${completionPct}%` }} />
            </div>
            <span className="meter-label">{completionPct}% พร้อมสร้าง</span>
            {(!profile || !profile.full_name) && (
              <Link className="btn btn-secondary btn-full mt-12" href="/profile">
                กรอกโปรไฟล์ก่อน
              </Link>
            )}
          </div>

          <div className="pw-tip">
            <GearSix weight="duotone" size={14} />
            <p>เลือกประกาศนียบัตรและเรียงลำดับตามต้องการ จากนั้นกดสร้าง</p>
          </div>

          {portfolioPages.length > 0 && (
            <div className="pw-saved">
              <p className="ws-eyebrow">ที่บันทึกแล้ว</p>
              <div className="pw-saved-list">
                {portfolioPages.map((page) => (
                  <div key={page.id} className="pw-saved-item">
                    <Link href={`/portfolio/${page.id}`} className="pw-saved-link">
                      <h4>{page.title}</h4>
                      <p>
                        {page.selected_certificate_ids?.length || 0} รายการ
                        {(() => {
                          const snap = page.content_snapshot as any;
                          const t = snap?.template || "modern";
                          return <> · {TEMPLATES.find((x) => x.id === t)?.name || t}</>;
                        })()}
                      </p>
                    </Link>
                    <button
                      className="pw-saved-pdf"
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
                      className="pw-saved-del"
                      onClick={() => setShowDeletePage(page)}
                      aria-label="ลบ"
                    >
                      <Trash weight="duotone" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

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
