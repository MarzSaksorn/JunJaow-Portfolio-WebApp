"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { usePageEntrance } from "@/hooks/use-page-entrance";
import {
  DesignSettings,
  DESIGN_DEFAULTS,
  mergeDesignSettings,
  GOOGLE_FONTS,
  presetAccent,
  heroGradient,
} from "@/lib/portfolio-design";
import { PortfolioDesignPanel } from "@/app/components/portfolio-design-panel";
import { PortfolioDesignPreview } from "@/app/components/portfolio-design-preview";
import { CheckCircle, ArrowLeft } from "@phosphor-icons/react";

export function DesignClient({ portfolioId }: { portfolioId: string }) {
  const rootRef = usePageEntrance<HTMLDivElement>();
  const router = useRouter();
  const [settings, setSettings] = useState<DesignSettings>({ ...DESIGN_DEFAULTS });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("portfolio_pages")
        .select("*")
        .eq("id", portfolioId)
        .single();

      if (data) {
        setPageData(data);
        const merged = mergeDesignSettings(data.design_settings as Partial<DesignSettings>);
        setSettings(merged);
      }
    }
    load();
  }, [portfolioId]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("portfolio_pages")
      .update({ design_settings: settings as any })
      .eq("id", portfolioId);

    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  const name = pageData?.title || "พอร์ตโฟลิโอ";

  return (
    <div ref={rootRef}>
      <header className="ws-header" data-animate="fade-up" data-order="1">
        <div>
          <p className="ws-eyebrow">ปรับแต่งดีไซน์</p>
          <h1>{name}</h1>
        </div>
        <div className="ws-header-actions">
          <Link className="btn btn-secondary" href="/portfolio">
            <ArrowLeft weight="duotone" /> กลับ
          </Link>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </header>

      <div className="ws-body" data-animate="fade-up" data-order="2">
        <div className="design-layout">
          <PortfolioDesignPanel
            settings={settings}
            onChange={setSettings}
          />
          <PortfolioDesignPreview
            page={pageData}
            settings={settings}
          />
        </div>

        {error && <p className="form-error mt-12">{error}</p>}
        {saved && (
          <p className="form-success mt-12">
            <CheckCircle weight="fill" size={14} /> บันทึกการปรับแต่งแล้ว
          </p>
        )}
      </div>
    </div>
  );
}
