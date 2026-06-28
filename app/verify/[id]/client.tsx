"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, SealCheck, ArrowLeft, CopySimple, DownloadSimple, ShareNetwork } from "@phosphor-icons/react";
import type { Database } from "@/lib/supabase/types";
import { formatFileSize, fileIcon, iconClass } from "@/lib/file-icons";

type Certificate = Database["public"]["Tables"]["certificates"]["Row"];

export function CertificateVerify({ certificate }: { certificate: Certificate }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  function shareUrl(platform: "line" | "facebook") {
    const url = encodeURIComponent(window.location.href);
    if (platform === "line") window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, "_blank", "noopener");
    else window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener");
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  const isImage = certificate.file_type?.startsWith("image/");
  const isPdf = certificate.file_type?.includes("pdf") || certificate.file_name?.toLowerCase().endsWith(".pdf");
  const fileSize = certificate.file_size ? formatFileSize(certificate.file_size) : null;

  const metaRows = [
    { label: "ผู้ออก", value: certificate.issuer },
    { label: "วันที่ออก", value: certificate.issued_at ? new Date(certificate.issued_at).toLocaleDateString("th-TH", {
      year: "numeric", month: "long", day: "numeric",
    }) : null },
    { label: "ปีการศึกษา", value: certificate.academic_year },
    { label: "หมวดหมู่", value: certificate.category },
    { label: "คำอธิบาย", value: certificate.description },
  ].filter(r => r.value);

  return (
    <div className="verify-layout">
      <div className="verify-card">
        <div className="verify-accent-bar" />

        <div className="verify-header">
          <div className="verify-badge">
            <ShieldCheck weight="fill" size={16} />
            <span>ตรวจสอบแล้ว</span>
          </div>
          <div className="verify-header-actions">
            <button className="btn btn-secondary" onClick={handleBack}>
              <ArrowLeft weight="duotone" /> กลับ
            </button>
            <button
              className={`btn btn-secondary${copied ? " btn-copied" : ""}`}
              onClick={handleCopyUrl}
              data-copied={copied || undefined}
            >
              <CopySimple weight="duotone" />
              <span>{copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}</span>
            </button>
            <div className="verify-share-group">
              <button className="btn btn-secondary" onClick={() => shareUrl("line")} aria-label="แชร์ไปยัง LINE">
                <ShareNetwork weight="duotone" /> LINE
              </button>
              <button className="btn btn-secondary" onClick={() => shareUrl("facebook")} aria-label="แชร์ไปยัง Facebook">
                <ShareNetwork weight="duotone" /> Facebook
              </button>
            </div>
          </div>
        </div>

        <div className="verify-body">
          <div className="verify-watermark" aria-hidden="true">VERIFIED</div>

          <h1 className="verify-title">{certificate.title}</h1>

          <div className="verify-meta">
            {metaRows.map((row, i) => (
              <div className="verify-meta-row" key={i}>
                <span className="verify-meta-label">{row.label}</span>
                <span className="verify-meta-value">{row.value}</span>
              </div>
            ))}
          </div>

          {certificate.file_url && (
            <div className="verify-preview">
              {isImage ? (
                <img src={certificate.file_url} alt={certificate.title} className="verify-image" loading="lazy" />
              ) : isPdf ? (
                <>
                  <iframe src={`${certificate.file_url}#view=FitH`} title={certificate.title} className="verify-pdf" loading="lazy" />
                  <a href={certificate.file_url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-primary verify-download-btn">
                    <DownloadSimple weight="duotone" /> ดาวน์โหลด PDF
                  </a>
                </>
              ) : (
                <div className="file-fallback" style={{ textAlign: "center", padding: 40 }}>
                  <div className={`file-fallback-icon ${iconClass(certificate.file_type || "")}`} style={{ margin: "0 auto" }}>
                    {fileIcon(certificate.file_type || "", true)}
                  </div>
                  {certificate.file_name && (
                    <p style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 8 }}>
                      {certificate.file_name}{fileSize ? ` (${fileSize})` : ""}
                    </p>
                  )}
                  <a href={certificate.file_url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-primary" style={{ marginTop: 12 }}>
                    <DownloadSimple weight="duotone" /> ดาวน์โหลดไฟล์
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="verify-footer">
          <span className="verify-footer-id">
            <span className="verify-footer-id-label">ID</span>
            <code className="verify-footer-id-code">{certificate.id}</code>
          </span>
          <span className="verify-footer-stamp">
            <SealCheck weight="fill" size={14} /> รับรองโดย JunJaow Portfolio
          </span>
        </div>
      </div>
    </div>
  );
}
