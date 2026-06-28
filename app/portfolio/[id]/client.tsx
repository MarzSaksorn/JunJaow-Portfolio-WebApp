"use client";

import Link from "next/link";
import { ArrowLeft, FilePdf, ShareNetwork } from "@phosphor-icons/react";
import { useState } from "react";
import {
  ModernTemplate,
  ClassicTemplate,
  TimelineTemplate,
} from "@/app/components/portfolio-templates";
import type { TemplateType } from "@/app/components/portfolio-templates";

type SnapshotCert = {
  title: string;
  issuer: string | null;
  description: string | null;
  academic_year: string | null;
  category: string | null;
  tags: string[] | null;
  file_url: string | null;
  file_type: string | null;
  issued_at: string | null;
};

type SnapshotProfile = {
  full_name: string | null;
  nickname: string | null;
  school: string | null;
  program: string | null;
  bio: string | null;
  skills: string[] | null;
  activities: string[] | null;
  contact: Record<string, string> | null;
  profile_image_url: string | null;
};

type Snapshot = {
  profile: SnapshotProfile | null;
  certificates: SnapshotCert[];
  generated_at: string;
};

type PageData = {
  id: string;
  title: string;
  content_snapshot: Snapshot;
  owner_id: string;
  template?: string;
};

function TemplateSwitch({ template, snapshot, title }: { template: string; snapshot: Snapshot; title: string }) {
  switch (template) {
    case "classic":
      return <ClassicTemplate snapshot={snapshot} title={title} />;
    case "timeline":
      return <TimelineTemplate snapshot={snapshot} title={title} />;
    default:
      return <ModernTemplate snapshot={snapshot} title={title} />;
  }
}

export function PortfolioView({ page }: { page: PageData }) {
  const snap = page.content_snapshot;
  const certs = snap?.certificates || [];
  const [pdfLoading, setPdfLoading] = useState(false);

  function shareUrl(platform: "line" | "facebook") {
    const url = encodeURIComponent(window.location.href);
    if (platform === "line") window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, "_blank", "noopener");
    else window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener");
  }

  async function downloadPdf() {
    setPdfLoading(true);
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
      alert("ไม่สามารถสร้าง PDF ได้");
    } finally {
      setPdfLoading(false);
    }
  }

  const template = (snap as any)?.template || "modern";
  const preset = template === "classic" ? "warm" : template === "timeline" ? "slate" : "";

  return (
    <main className="public-portfolio" data-color-preset={preset || undefined}>
      <header className="public-portfolio-head">
        <div className="public-portfolio-head-inner">
          <div className="public-portfolio-brand">
            <button
              className="portfolio-back-btn"
              onClick={() => window.history.back()}
              aria-label="กลับ"
            >
              <ArrowLeft weight="duotone" size={18} />
            </button>
            <Link href="/" className="binder-mark" style={{ width: 36, height: 36, fontSize: 16 }}>
              Jj
            </Link>
          </div>
          <div className="portfolio-share-group">
            <button className="btn btn-secondary btn-sm" onClick={() => shareUrl("line")} aria-label="แชร์ LINE">
              <ShareNetwork weight="duotone" size={14} /> LINE
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => shareUrl("facebook")} aria-label="แชร์ Facebook">
              <ShareNetwork weight="duotone" size={14} /> FB
            </button>
          </div>
          <button className="btn btn-primary btn-sm" onClick={downloadPdf} disabled={pdfLoading}>
            <FilePdf weight="duotone" size={16} />
            {pdfLoading ? "กำลังสร้าง..." : "ดาวน์โหลด PDF"}
          </button>
        </div>
      </header>

      <section className="portfolio-title-hero">
        <div className="portfolio-title-hero-inner">
          <h1 className="portfolio-cinematic-title">{page.title}</h1>
          <div className="portfolio-title-bar" />
        </div>
      </section>

      <TemplateSwitch
        template={template}
        snapshot={snap}
        title={page.title}
      />

      <footer className="public-portfolio-foot">
        <div className="portfolio-foot-stats">
          <span className="dot-tag tag-mint">{certs.length} รายการ</span>
        </div>
        <p>สร้างด้วย JunJaow Portfolio · {new Date(snap?.generated_at || "").toLocaleDateString("th-TH")}</p>
      </footer>
    </main>
  );
}
