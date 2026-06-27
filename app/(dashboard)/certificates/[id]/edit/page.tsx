"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";

const years = ["2569", "2570", "2571", "2572"];
const categories = [
  "วิชาการ", "กีฬา", "ศิลปะ", "ภาวะผู้นำ",
  "บริการ", "การแข่งขัน", "อบรม", "อื่นๆ",
];

export default function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    issuer: "",
    description: "",
    academic_year: "",
    category: "",
    tags: "",
    issued_at: "",
  });

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", id)
        .single();

      const cert = data as {
        title: string; issuer: string | null; description: string | null;
        academic_year: string | null; category: string | null;
        tags: string[] | null; issued_at: string | null;
      } | null;

      if (cert) {
        setForm({
          title: cert.title,
          issuer: cert.issuer || "",
          description: cert.description || "",
          academic_year: cert.academic_year || "",
          category: cert.category || "",
          tags: (cert.tags || []).join(", "),
          issued_at: cert.issued_at || "",
        });
      }
    }
    load();
  }, [id]);

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
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const { error: updateError } = await supabase
      .from("certificates" as any)
      .update({
        title: form.title,
        issuer: form.issuer,
        description: form.description,
        academic_year: form.academic_year,
        category: form.category,
        tags,
        issued_at: form.issued_at || null,
      } as any)
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push(`/certificates/${id}`);
  }

  useEntranceAnimation(rootRef);

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
                <input name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>ผู้ออก</label>
                <input name="issuer" value={form.issuer} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>คำอธิบาย</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
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
                <label>แท็ก (คั่นด้วยจุลภาค)</label>
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="วิทยาศาสตร์, การแข่งขัน" />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
              ยกเลิก
            </button>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "อัปเดตประกาศนียบัตร"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
