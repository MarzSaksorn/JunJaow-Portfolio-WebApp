"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";
import { logActivity } from "@/lib/activity";
import { fileIcon, iconClass, formatFileSize } from "@/lib/file-icons";
import {
  DownloadSimple,
  PencilLine,
  Trash,
  ArrowLeft,
  ArrowClockwise,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import type { Database } from "@/lib/supabase/types";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

const dotTagColor = (tag: string) => {
  const colors = ["tag-clip", "tag-pink", "tag-mint", "tag-lavender"];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = ((hash << 5) - hash) + tag.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
};

export function CertificateDetail() {
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [rotation, setRotation] = useState(0);

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
      logActivity("cert_deleted", "certificate", certificate.id, {
        title: certificate.title,
      });
      router.push("/certificates");
    }
  }

  useEntranceAnimation(rootRef);

  if (!certificate) return null;

  const isImage = certificate.file_type?.startsWith("image/");
  const isPdf = certificate.file_type?.includes("pdf") || certificate.file_name?.toLowerCase().endsWith(".pdf");
  const fileSize = certificate.file_size ? formatFileSize(certificate.file_size) : null;

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
        <div className="ws-header-actions">
          <Link className="btn btn-secondary" href="/certificates">
            <ArrowLeft weight="duotone" /> กลับ
          </Link>
          <Link
            href={`/certificates/${certificate.id}/edit`}
            className="btn btn-secondary"
          >
            <PencilLine weight="duotone" /> แก้ไข
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash weight="duotone" /> ลบ
          </button>
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

            <div className="detail-media" data-entrance-preview>
              {isImage && certificate.file_url ? (
                <div className="detail-img-rotate">
                  <img
                    src={certificate.file_url}
                    alt={certificate.title}
                    className="detail-image"
                    style={{ transform: `rotate(${rotation}deg)` }}
                    loading="lazy"
                  />
                  <div className="detail-rotate-actions">
                    <button className="btn-rotate" onClick={() => setRotation(r => r - 90)} title="หมุนซ้าย">
                      <ArrowCounterClockwise weight="duotone" size={16} />
                    </button>
                    <span className="rotate-label">{rotation}°</span>
                    <button className="btn-rotate" onClick={() => setRotation(r => r + 90)} title="หมุนขวา">
                      <ArrowClockwise weight="duotone" size={16} />
                    </button>
                  </div>
                </div>
              ) : isPdf && certificate.file_url ? (
                <div className="detail-pdf-wrap">
                  <iframe
                    src={`${certificate.file_url}#view=FitH`}
                    title={certificate.title}
                    className="detail-pdf"
                    loading="lazy"
                  />
                  <a
                    href={certificate.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ marginTop: 8, width: "100%", justifyContent: "center" }}
                  >
                    <DownloadSimple weight="duotone" /> ดาวน์โหลด PDF
                  </a>
                </div>
              ) : (
                <div className="file-fallback">
                  <div className={`file-fallback-icon ${iconClass(certificate.file_type || "")}`}>
                    {fileIcon(certificate.file_type || "", true)}
                  </div>
                  {certificate.file_name && (
                    <p style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 8 }}>
                      {certificate.file_name}
                      {fileSize ? ` (${fileSize})` : ""}
                    </p>
                  )}
                  {certificate.file_url && (
                    <a
                      href={certificate.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ marginTop: 8 }}
                    >
                      <DownloadSimple weight="duotone" /> ดาวน์โหลดไฟล์
                    </a>
                  )}
                </div>
              )}
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}
