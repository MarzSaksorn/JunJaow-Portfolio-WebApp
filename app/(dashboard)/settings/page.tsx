"use client";

import { useRef, useState } from "react";
import { useEntranceAnimation } from "@/lib/animations";
import { presets, applyPreset, getSavedPreset } from "@/lib/color-themes";
import { createClient } from "@/lib/supabase/browser";
import { CheckCircle, DownloadSimple, UploadSimple } from "@phosphor-icons/react";

export default function SettingsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  useEntranceAnimation(rootRef);
  const [active, setActive] = useState(getSavedPreset);
  const [backupMsg, setBackupMsg] = useState("");
  const [importing, setImporting] = useState(false);

  function handleSelect(id: string) {
    setActive(id);
    applyPreset(id);
  }

  async function handleExport() {
    setBackupMsg("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [certs, profiles, portfolios] = await Promise.all([
      supabase.from("certificates").select("*").eq("owner_id", user.id),
      supabase.from("profiles").select("*").eq("owner_id", user.id).single(),
      supabase.from("portfolio_pages").select("*").eq("owner_id", user.id),
    ]);

    const backup = {
      exported_at: new Date().toISOString(),
      user_id: user.id,
      certificates: certs.data || [],
      profile: profiles.data || null,
      portfolios: portfolios.data || [],
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `junjaow-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMsg("ส่งออกข้อมูลสำเร็จ");
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setBackupMsg("");

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.certificates || !data.profile) {
        setBackupMsg("ไฟล์ข้อมูลไม่สมบูรณ์ — ต้องมี certificates และ profile");
        setImporting(false);
        return;
      }

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Import profile
      if (data.profile) {
        const { full_name, nickname, school, program, bio, skills, activities, contact, profile_image_url } = data.profile;
        await supabase.from("profiles").upsert({
          owner_id: user.id,
          full_name, nickname, school, program, bio, skills, activities, contact, profile_image_url,
        });
      }

      // Import certificates
      for (const cert of data.certificates) {
        const { title, issuer, description, academic_year, category, tags, file_url, file_type, issued_at } = cert;
        await supabase.from("certificates").upsert({
          owner_id: user.id,
          title, issuer, description, academic_year, category, tags, file_url, file_type, issued_at,
        });
      }

      setBackupMsg(`นำเข้าข้อมูลสำเร็จ — ${data.certificates.length} ประกาศนียบัตร, โปรไฟล์ 1 รายการ`);
    } catch {
      setBackupMsg("ไม่สามารถอ่านไฟล์ข้อมูลได้ — ตรวจสอบรูปแบบ JSON");
    }
    setImporting(false);
    if (importRef.current) importRef.current.value = "";
  }

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">ตั้งค่า</p>
          <h1>ธีมสี</h1>
        </div>
      </header>

      <div className="ws-body">
        <div className="form-card" data-entrance-form>
          <p style={{ color: "var(--ink-muted)", fontSize: 14, marginBottom: 20 }}>
            เลือกชุดสีสำหรับทั้งระบบ
          </p>

          <div className="theme-grid">
            {presets.map((p) => (
              <button
                key={p.id}
                className={`theme-card${active === p.id ? " active" : ""}`}
                onClick={() => handleSelect(p.id)}
              >
                <div className="theme-swatch" style={{ background: p.accent }} />
                <div className="theme-body">
                  <strong>{p.name}</strong>
                  <span>{p.nameEn}</span>
                  <small>{p.desc}</small>
                </div>
                {active === p.id && (
                  <span className="theme-check">
                    <CheckCircle weight="fill" size={18} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="form-card" data-entrance-form style={{ marginTop: 24 }}>
          <p className="ws-eyebrow">การจัดการข้อมูล</p>
          <h3 style={{ margin: "4px 0 16px" }}>สำรองและกู้คืนข้อมูล</h3>

          <div className="backup-actions">
            <button className="btn btn-secondary" onClick={handleExport}>
              <DownloadSimple weight="duotone" /> ส่งออกข้อมูล (JSON)
            </button>
            <button className="btn btn-secondary" onClick={() => importRef.current?.click()} disabled={importing}>
              <UploadSimple weight="duotone" /> {importing ? "กำลังนำเข้า..." : "นำเข้าข้อมูล (JSON)"}
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleImport}
            />
          </div>

          {backupMsg && (
            <p className="form-success" style={{ marginTop: 12 }}>{backupMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
