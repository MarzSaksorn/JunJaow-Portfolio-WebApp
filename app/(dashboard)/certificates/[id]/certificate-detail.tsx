"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import {
  FilePdf,
  Image,
  FileText,
  File,
  DownloadSimple,
  PencilLine,
  Trash,
  ArrowLeft,
} from "@phosphor-icons/react";
import type { Database } from "@/lib/supabase/types";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

const dotTagColor = (tag: string) => {
  const colors = ["tag-clip", "tag-pink", "tag-mint", "tag-lavender"];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = ((hash << 5) - hash) + tag.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
};

const fileIconClass = (type: string) => {
  const t = (type || "").toUpperCase();
  if (t.includes("PDF")) return "pdf";
  if (t.includes("IMAGE") || t.includes("PNG") || t.includes("JPG") || t.includes("JPEG")) return "image";
  if (t.includes("DOC") || t.includes("WORD")) return "doc";
  return "other";
};

const fileIcon = (type: string, large?: boolean) => {
  const size = large ? 32 : 20;
  const t = (type || "").toUpperCase();
  if (t.includes("PDF")) return <FilePdf weight="duotone" size={size} />;
  if (t.includes("IMAGE") || t.includes("PNG") || t.includes("JPG") || t.includes("JPEG")) return <Image weight="duotone" size={size} />;
  if (t.includes("DOC") || t.includes("WORD")) return <FileText weight="duotone" size={size} />;
  return <File weight="duotone" size={size} />;
};

export function CertificateDetail() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [certificate, setCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data: cert } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", id)
        .single();

      if (cancelled) return;

      if (!cert) {
        router.push("/certificates");
        return;
      }

      setCertificate(cert as Certificate);
    }
    load();
    return () => { cancelled = true; };
  }, [id, router]);

  async function handleDelete() {
    if (!certificate || !confirm("ลบประกาศนียบัตรนี้?")) return;

    const supabase = createClient();

    if (certificate.file_path) {
      await supabase.storage.from("certificate-files").remove([certificate.file_path]);
    }

    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", certificate.id);

    if (!error) {
      router.push("/certificates");
    }
  }

  useEntranceAnimation(rootRef);

  if (!certificate) return null;

  const isImage = certificate.file_type?.startsWith("image/");

  return (
    <div ref={rootRef}>
      <header className="ws-header">
        <div>
          <p className="ws-eyebrow">
            {certificate.academic_year
              ? `ปีการศึกษา ${certificate.academic_year}`
              : "ประกาศนียบัตร"}
          </p>
          <h1 style={{ fontSize: "clamp(24px, 2.8vw, 38px)" }}>{certificate.title}</h1>
        </div>
      </header>

      <div className="ws-body">
        <div className="detail-grid" data-entrance-detail>
          <div className="detail-content">
            {certificate.issuer && (
              <div className="detail-row">
                <span className="detail-label">ผู้ออก</span>
                <p>{certificate.issuer}</p>
              </div>
            )}

            {certificate.description && (
              <div className="detail-row">
                <span className="detail-label">คำอธิบาย</span>
                <p>{certificate.description}</p>
              </div>
            )}

            {certificate.issued_at && (
              <div className="detail-row">
                <span className="detail-label">วันที่ออก</span>
                <p>{new Date(certificate.issued_at).toLocaleDateString()}</p>
              </div>
            )}

            {certificate.category && (
              <div className="detail-row">
                <span className="detail-label">หมวดหมู่</span>
                <p>{certificate.category}</p>
              </div>
            )}

            {certificate.tags && certificate.tags.length > 0 && (
              <div className="detail-row">
                <span className="detail-label">แท็ก</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                  {certificate.tags.map((tag) => (
                    <span className={`dot-tag ${dotTagColor(tag)}`} key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {certificate.file_name && (
              <div className="detail-row">
                <span className="detail-label">ไฟล์</span>
                <p>{certificate.file_name}</p>
              </div>
            )}

            <div className="detail-actions">
              <Link
                href={`/certificates/${certificate.id}/edit`}
                className="btn btn-secondary"
              >
                <PencilLine weight="duotone" /> แก้ไข
              </Link>
              <button className="btn btn-secondary" onClick={handleDelete}>
                <Trash weight="duotone" /> ลบ
              </button>
              <Link className="btn btn-secondary" href="/certificates">
                <ArrowLeft weight="duotone" /> กลับ
              </Link>
            </div>
          </div>

          <div className="detail-media" data-entrance-preview>
            {isImage && certificate.file_url ? (
              <img
                src={certificate.file_url}
                alt={certificate.title}
                className="detail-image"
                loading="lazy"
              />
            ) : (
              <div className="file-fallback">
                <div className={`file-fallback-icon ${fileIconClass(certificate.file_type || "")}`}>
                  {fileIcon(certificate.file_type || "", true)}
                </div>
                {certificate.file_url && (
                  <a
                    href={certificate.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <DownloadSimple weight="duotone" /> ดาวน์โหลดไฟล์
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
