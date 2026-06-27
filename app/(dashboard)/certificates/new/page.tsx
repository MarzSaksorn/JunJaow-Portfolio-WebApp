"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";

const years = ["2569", "2570", "2571", "2572"];
const categories = [
  "วิชาการ", "กีฬา", "ศิลปะ", "ภาวะผู้นำ",
  "บริการ", "การแข่งขัน", "อบรม", "อื่นๆ",
];

export default function NewCertificatePage() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    issuer: "",
    description: "",
    academic_year: "",
    category: "",
    tags: "",
    issued_at: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.title) {
      setError("กรุณากรอกชื่อเรื่อง");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("คุณต้องเข้าสู่ระบบ");
      setLoading(false);
      return;
    }

    let fileUrl = "";
    let fileStoragePath = "";
    let fileName = "";
    let fileType = "";
    let fileSize = 0;

    if (file) {
      fileStoragePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("certificate-files")
        .upload(fileStoragePath, file);

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("certificate-files")
        .getPublicUrl(fileStoragePath);

      fileUrl = urlData.publicUrl;
      fileName = file.name;
      fileType = file.type;
      fileSize = file.size;
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error: insertError } = await supabase.from("certificates").insert({
      owner_id: user.id,
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
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/certificates");
  }

  useEntranceAnimation(rootRef);

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">คลังประกาศนียบัตร</p>
          <h1>อัปโหลดประกาศนียบัตรใหม่</h1>
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
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="ชื่อประกาศนียบัตร"
                  required
                />
              </div>

              <div className="form-field">
                <label>ผู้ออก</label>
                <input
                  name="issuer"
                  value={form.issuer}
                  onChange={handleChange}
                  placeholder="องค์กรหรือสถาบัน"
                />
              </div>

              <div className="form-field">
                <label>คำอธิบาย</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="เพื่ออะไร?"
                  rows={3}
                />
              </div>

              <div className="form-field">
                <label>วันที่ออก</label>
                <input
                  type="date"
                  name="issued_at"
                  value={form.issued_at}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-col">
              <div className="form-field">
                <label>ปีการศึกษา</label>
                <select name="academic_year" value={form.academic_year} onChange={handleChange}>
                  <option value="">เลือกปี</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>หมวดหมู่</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>แท็ก (คั่นด้วยจุลภาค)</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="วิทยาศาสตร์, การแข่งขัน"
                />
              </div>

              <div className="form-field">
                <label>ไฟล์ (รูปภาพหรือเอกสาร)</label>
                <div className="file-drop">
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <p><strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
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
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "กำลังอัปโหลด..." : "บันทึกประกาศนียบัตร"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
