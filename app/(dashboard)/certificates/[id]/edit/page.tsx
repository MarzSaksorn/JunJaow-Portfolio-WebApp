"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import { logActivity } from "@/lib/activity";
import { fileIcon, iconClass, formatFileSize } from "@/lib/file-icons";
import { TagInput } from "@/app/components/tag-input";
import { IssuerInput } from "@/app/components/issuer-input";

const years = ["2569", "2570", "2571", "2572"];
const categories = [
  "วิชาการ", "กีฬา", "ศิลปะ", "ภาวะผู้นำ",
  "บริการ", "การแข่งขัน", "อบรม", "อื่นๆ",
];

type FormState = {
  title: string;
  issuer: string;
  description: string;
  academic_year: string;
  category: string;
  tags: string;
  issued_at: string;
};

export default function EditCertificatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const rootRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<{
    name: string; type: string; size: number; url: string; path: string;
  } | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "", issuer: "", description: "",
    academic_year: "", category: "", tags: "", issued_at: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError("ไม่พบข้อมูลประกาศนียบัตร");
          setLoading(false);
          return;
        }
        setForm({
          title: data.title || "",
          issuer: data.issuer || "",
          description: data.description || "",
          academic_year: data.academic_year || "",
          category: data.category || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          issued_at: data.issued_at || "",
        });
        if (data.file_url) {
          setExistingFile({
            name: data.file_name || "",
            type: data.file_type || "",
            size: data.file_size || 0,
            url: data.file_url,
            path: data.file_path || "",
          });
        }
        setLoading(false);
      });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title) { setError("กรุณากรอกชื่อเรื่อง"); return; }
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("คุณต้องเข้าสู่ระบบ"); setSaving(false); return; }

    let fileUrl = existingFile?.url || "";
    let fileStoragePath = existingFile?.path || "";
    let fileName = existingFile?.name || "";
    let fileType = existingFile?.type || "";
    let fileSize = existingFile?.size || 0;

    if (file) {
      if (existingFile?.path) {
        await supabase.storage.from("certificate-files").remove([existingFile.path]);
      }
      fileStoragePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("certificate-files")
        .upload(fileStoragePath, file);
      if (uploadError) { setError(uploadError.message); setSaving(false); return; }

      const { data: urlData } = supabase.storage.from("certificate-files").getPublicUrl(fileStoragePath);
      fileUrl = urlData.publicUrl;
      fileName = file.name;
      fileType = file.type;
      fileSize = file.size;
    }

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const { error: updateError } = await supabase
      .from("certificates")
      .update({
        title: form.title,
        issuer: form.issuer,
        description: form.description,
        academic_year: form.academic_year,
        category: form.category,
        tags,
        file_url: fileUrl,
        file_path: fileStoragePath,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        issued_at: form.issued_at || null,
      })
      .eq("id", id);

    if (updateError) { setError(updateError.message); setSaving(false); return; }

    logActivity("cert_updated", "certificate", id, { title: form.title });
    router.push(`/certificates/${id}`);
  }

  useEntranceAnimation(rootRef);

  if (loading) return null;

  if (error && !form.title) {
    return (
      <div ref={rootRef} className="ws-body" style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--ink-muted)" }}>{error}</p>
        <button className="btn btn-secondary" onClick={() => router.push("/certificates")}>
          กลับไปหน้ารายการ
        </button>
      </div>
    );
  }

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">คลังประกาศนียบัตร</p>
          <h1>แก้ไขประกาศนียบัตร</h1>
        </div>
      </header>

      <div className="ws-body">
        <form className="form-card" onSubmit={handleSubmit} data-entrance-form>
          {error && <p className="form-error">{error}</p>}

          <div className="form-grid">
            <div className="form-col">
              <div className="form-field">
                <label>ชื่อเรื่อง *</label>
                <input
                  name="title" value={form.title} onChange={handleChange}
                  placeholder="ชื่อประกาศนียบัตร" required
                />
              </div>

              <div className="form-field">
                <label>ผู้ออก</label>
                <IssuerInput
                  value={form.issuer}
                  onChange={(val) => handleChange({ target: { name: "issuer", value: val } } as any)}
                />
              </div>

              <div className="form-field">
                <label>คำอธิบาย</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange}
                  placeholder="เพื่ออะไร?" rows={3}
                />
              </div>

              <div className="form-field">
                <label>วันที่ออก</label>
                <input type="date" name="issued_at" value={form.issued_at} onChange={handleChange} />
              </div>
            </div>

            <div className="form-col">
              <div className="form-field">
                <label>ปีการศึกษา</label>
                <select name="academic_year" value={form.academic_year} onChange={handleChange}>
                  <option value="">เลือกปี</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label>หมวดหมู่</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label>แท็ก</label>
                <TagInput
                  value={form.tags}
                  onChange={(val) => setForm({ ...form, tags: val })}
                  placeholder="วิทยาศาสตร์, การแข่งขัน"
                />
              </div>

              <div className="form-field">
                <label>ไฟล์</label>
                <div className="file-drop">
                  <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFile} />
                  {file ? (
                    <p className="file-preview-selected">
                      <span className={`file-preview-icon ${iconClass(file.type || "")}`}>
                        {fileIcon(file.type || file.name)}
                      </span>
                      <span className="file-preview-text">
                        <strong>{file.name}</strong><br />
                        <small>{formatFileSize(file.size)}</small>
                      </span>
                    </p>
                  ) : existingFile?.url ? (
                    <p className="file-preview-selected">
                      <span className={`file-preview-icon ${iconClass(existingFile.type || "")}`}>
                        {fileIcon(existingFile.type || existingFile.name)}
                      </span>
                      <span className="file-preview-text">
                        <strong>{existingFile.name}</strong>
                        {existingFile.size > 0 && <><br /><small>{formatFileSize(existingFile.size)}</small></>}
                        <br /><small style={{ color: "var(--clip)" }}>คลิกเพื่อเปลี่ยนไฟล์</small>
                      </span>
                    </p>
                  ) : (
                    <p>ลากไฟล์มาวางหรือคลิกเพื่อเลือก</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
              ยกเลิก
            </button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
