"use client";

import Link from "next/link";
import { ArrowLeft, FilePdf, ShareNetwork } from "@phosphor-icons/react";
import { useState } from "react";
import { usePageEntrance } from "@/hooks/use-page-entrance";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { FadeIn } from "@/app/components/fade-in";
import { ConfirmDialog } from "@/app/components/confirm-dialog";
import {
  ModernTemplate,
  ClassicTemplate,
  TimelineTemplate,
} from "@/app/components/portfolio-templates";
import type { TemplateType } from "@/app/components/portfolio-templates";
import { mergeDesignSettings, heroGradient } from "@/lib/portfolio-design";
import type { DesignSettings } from "@/lib/portfolio-design";

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
  design_settings?: Partial<DesignSettings>;
};

function TemplateSwitch({ template, snapshot, title, ds }: { template: string; snapshot: Snapshot; title: string; ds?: { cert_columns?: 2|3|4; section_order?: string[] } }) {
  const props = { snapshot, title, designSettings: ds };
  switch (template) {
    case "classic":
      return <ClassicTemplate {...props} />;
    case "timeline":
      return <TimelineTemplate {...props} />;
    default:
      return <ModernTemplate {...props} />;
  }
}

export function PortfolioView({ page }: { page: PageData }) {
  const rootRef = usePageEntrance<HTMLDivElement>();
  const scrollRef = useScrollReveal<HTMLDivElement>();
  const snap = page.content_snapshot;
  const certs = snap?.certificates || [];
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showPdfError, setShowPdfError] = useState(false);

  const ds = mergeDesignSettings(page.design_settings);
  const dsTemplate = { cert_columns: ds.layout.cert_columns, section_order: ds.layout.section_order };
  const preset = ds.preset;
  const accent = ds.accent_color || (() => {
    const map: Record<string, string> = { lavender: "#f87195", warm: "#c4842d", mint: "#2d9d7a", slate: "#3b82f6" };
    return map[preset] || "#f87195";
  })();
  const heroBg = ds.hero.background_type === "gradient"
    ? heroGradient(ds.preset, accent)
    : ds.hero.background_type === "solid"
    ? ds.hero.background_value
    : undefined;

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
      setShowPdfError(true);
    } finally {
      setPdfLoading(false);
    }
  }

  const template = (snap as any)?.template || "modern";

  const fontsFamilies = [ds.typography.heading_font, ds.typography.body_font]
    .filter((f, i, a) => a.indexOf(f) === i)
    .map((f) => f.replace(/ /g, "+"))
    .join("&family=");
  const fontsHref = `https://fonts.googleapis.com/css2?family=${fontsFamilies}:wght@300;400;500;600;700&display=swap`;

  return (
    <main className="public-portfolio" id="main-content" data-color-preset={preset} ref={rootRef}>
      <link href={fontsHref} rel="stylesheet" />
      <style>{`
        .public-portfolio { --portfolio-accent: ${accent}; }
        .public-portfolio .portfolio-title-hero h1,
        .public-portfolio .tm-entry h4,
        .public-portfolio .cert-card h4 { font-family: '${ds.typography.heading_font}', Mali, sans-serif; }
        .public-portfolio, .public-portfolio p { font-family: '${ds.typography.body_font}', Mali, sans-serif; }
        .public-portfolio .cert-grid { grid-template-columns: repeat(${ds.layout.cert_columns}, 1fr); }
        ${heroBg ? `.public-portfolio .portfolio-title-hero { background: ${heroBg}; }` : ""}
      `}</style>

      <header className="public-portfolio-head" data-animate="fade-up" data-order="1">
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

      <section className="portfolio-title-hero" data-animate="fade-up" data-order="2">
        <div className="portfolio-title-hero-inner">
          <h1 className="portfolio-cinematic-title">{page.title}</h1>
          <div className="portfolio-title-bar" style={{ background: accent }} />
          {ds.hero.subtitle && <p className="portfolio-hero-subtitle">{ds.hero.subtitle}</p>}
        </div>
      </section>

      <TemplateSwitch
        template={template}
        snapshot={snap}
        title={page.title}
        ds={dsTemplate}
      />

      <footer className="public-portfolio-foot" data-scroll="fade-up">
        <div className="portfolio-foot-stats">
          <span className="dot-tag tag-mint">{certs.length} รายการ</span>
        </div>
        <p>สร้างด้วย JunJaow Portfolio · {new Date(snap?.generated_at || "").toLocaleDateString("th-TH")}</p>
      </footer>

      <ConfirmDialog
        open={showPdfError}
        title="เกิดข้อผิดพลาด"
        message="ไม่สามารถสร้าง PDF ได้ กรุณาลองอีกครั้ง"
        confirmLabel="ตกลง"
        onConfirm={() => setShowPdfError(false)}
        onCancel={() => setShowPdfError(false)}
      />
    </main>
  );
}
