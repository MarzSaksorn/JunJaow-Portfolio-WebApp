"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import { logActivity } from "@/lib/activity";
import { fileIcon, iconClass, formatFileSize } from "@/lib/file-icons";
import { TagInput } from "@/app/components/tag-input";
import { IssuerInput } from "@/app/components/issuer-input";
import { CheckCircle, Spinner, XCircle } from "@phosphor-icons/react";

const years = ["2569", "2570", "2571", "2572"];
const categories = [
  "วิชาการ", "กีฬา", "ศิลปะ", "ภาวะผู้นำ",
  "บริการ", "การแข่งขัน", "อบรม", "อื่นๆ",
];

type FileEntry = {
  id: number;
  file: File;
  title: string;
  issuer: string;
  academic_year: string;
  category: string;
  tags: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

export default function BulkUploadPage() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [duplicatesMap, setDuplicatesMap] = useState<Record<number, { id: string; title: string }[]>>({});
  const doneCount = entries.filter((e) => e.status === "done").length;
  const allDone = entries.length > 0 && doneCount === entries.length;

  function addFiles(files: FileList | null) {
    if (!files) return;
    const newEntries: FileEntry[] = Array.from(files).map((f, i) => ({
      id: Date.now() + i,
      file: f,
      title: f.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
      issuer: "",
      academic_year: "",
      category: "",
      tags: "",
      status: "pending" as const,
    }));
    setEntries((prev) => [...prev, ...newEntries]);
  }

  function updateEntry(id: number, field: keyof Pick<FileEntry, "title" | "issuer" | "academic_year" | "category" | "tags">, value: string) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }

  function removeEntry(id: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDuplicatesMap((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  useEffect(() => {
    const pending = entries.filter((e) => e.status === "pending" && e.title);
    if (pending.length === 0) return;
    const t = setTimeout(async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      for (const entry of pending) {
        let q = supabase
          .from("certificates")
          .select("id, title")
          .eq("owner_id", user.id)
          .eq("title", entry.title);
        if (entry.issuer) q = q.eq("issuer", entry.issuer);
        if (entry.academic_year) q = q.eq("academic_year", entry.academic_year);
        const { data } = await q;
        const found = (data || []) as { id: string; title: string }[];
        setDuplicatesMap((prev) => {
          if (JSON.stringify(prev[entry.id]) === JSON.stringify(found)) return prev;
          return { ...prev, [entry.id]: found };
        });
      }
    }, 800);
    return () => clearTimeout(t);
  }, [entries.map((e) => `${e.id}:${e.title}:${e.issuer}:${e.academic_year}`).join("|")]);


  async function handleSubmit() {
    const hasEmpty = entries.some((e) => !e.title.trim());
    if (hasEmpty) { setError("กรุณากรอกชื่อเรื่องให้ครบทุกไฟล์"); return; }
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("คุณต้องเข้าสู่ระบบ"); setSubmitting(false); return; }

    for (const entry of entries) {
      if (entry.status === "done") continue;
      setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, status: "uploading" } : e)));

      const file = entry.file;
      const storagePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("certificate-files")
        .upload(storagePath, file);

      if (uploadError) {
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, status: "error", error: uploadError.message } : e)));
        continue;
      }

      const { data: urlData } = supabase.storage.from("certificate-files").getPublicUrl(storagePath);
      const tags = entry.tags.split(",").map((t) => t.trim()).filter(Boolean);

      const { error: insertError } = await supabase.from("certificates").insert({
        owner_id: user.id,
        title: entry.title,
        issuer: entry.issuer || null,
        academic_year: entry.academic_year || null,
        category: entry.category || null,
        tags,
        file_url: urlData.publicUrl,
        file_path: storagePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
      });

      if (insertError) {
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, status: "error", error: insertError.message } : e)));
      } else {
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, status: "done" } : e)));
        logActivity("cert_created", "certificate", undefined, { title: entry.title });
      }
    }

    setSubmitting(false);
  }

  useEntranceAnimation(rootRef);

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">คลังประกาศนียบัตร</p>
          <h1>อัปโหลดหลายไฟล์</h1>
        </div>
        <div className="ws-header-actions">
          <Link className="btn btn-secondary" href="/certificates/new">อัปโหลดทีละไฟล์</Link>
        </div>
      </header>

      <div className="ws-body">
        <div className="form-card" data-entrance-form>
          {error && <p className="form-error">{error}</p>}

          <div className="bulk-dropzone" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={(e) => addFiles(e.target.files)}
            />
            <p>
              {entries.length > 0
                ? `เลือกไปแล้ว ${entries.length} ไฟล์ — คลิกเพื่อเพิ่ม`
                : "คลิกเพื่อเลือกหลายไฟล์ (รูปภาพ / PDF / เอกสาร)"}
            </p>
          </div>

          {entries.length > 0 && (
            <div className="bulk-list">
              {entries.map((entry) => (
                <div key={entry.id} className={`bulk-card ${entry.status}`}>
                  <div className="bulk-card-header">
                    <span className={`bulk-icon ${iconClass(entry.file.type || entry.file.name)}`}>
                      {fileIcon(entry.file.type || entry.file.name)}
                    </span>
                    <div className="bulk-meta">
                      <strong>{entry.file.name}</strong>
                      <small>{formatFileSize(entry.file.size)}</small>
                    </div>
                    <div className="bulk-status">
                      {entry.status === "uploading" && <Spinner weight="duotone" className="spin" />}
                      {entry.status === "done" && <CheckCircle weight="duotone" color="var(--mint)" />}
                      {entry.status === "error" && <XCircle weight="duotone" color="#e74c3c" />}
                    </div>
                    {entry.status === "pending" && (
                      <button className="bulk-remove" onClick={() => removeEntry(entry.id)}>×</button>
                    )}
                  </div>

                  {entry.status === "pending" && (
                    <div className="bulk-card-body">
                      {duplicatesMap[entry.id]?.length > 0 && (
                        <p className="bulk-dup-warning">
                          พบที่ใกล้เคียง: {duplicatesMap[entry.id].map((d) => `"${d.title}"`).join(", ")}
                        </p>
                      )}
                      <div className="bulk-form-row">
                        <IssuerInput
                          value={entry.issuer}
                          onChange={(val) => updateEntry(entry.id, "issuer", val)}
                          placeholder="ผู้ออก"
                        />
                        <input
                          placeholder="ชื่อเรื่อง *"
                          value={entry.title}
                          onChange={(e) => updateEntry(entry.id, "title", e.target.value)}
                          required
                        />
                        <select
                          value={entry.academic_year}
                          onChange={(e) => updateEntry(entry.id, "academic_year", e.target.value)}
                        >
                          <option value="">ปีการศึกษา</option>
                          {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select
                          value={entry.category}
                          onChange={(e) => updateEntry(entry.id, "category", e.target.value)}
                        >
                          <option value="">หมวดหมู่</option>
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="bulk-form-row">
                        <TagInput
                          value={entry.tags}
                          onChange={(val) => updateEntry(entry.id, "tags", val)}
                          placeholder="แท็ก"
                        />
                      </div>
                    </div>
                  )}

                  {entry.status === "error" && entry.error && (
                    <p className="bulk-error">{entry.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <Link className="btn btn-secondary" href="/certificates">กลับไปหน้ารายการ</Link>
            {entries.length > 0 && !allDone && (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "กำลังอัปโหลด..." : `อัปโหลดทั้งหมด (${entries.length - doneCount} รายการ)`}
              </button>
            )}
            {allDone && (
              <button className="btn btn-primary" onClick={() => router.push("/certificates")}>
                เสร็จสิ้น — ดูรายการ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
