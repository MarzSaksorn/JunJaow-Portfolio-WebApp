"use client";

import { useEffect, useRef, useMemo } from "react";
import { DesignSettings, heroGradient } from "@/lib/portfolio-design";

interface Props {
  page: any;
  settings: DesignSettings;
}

const sectionLabel: Record<string, string> = {
  profile: "โปรไฟล์",
  certificates: "ประกาศนียบัตร",
};

export function PortfolioDesignPreview({ page, settings }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const snap = page?.content_snapshot;
  const profile = snap?.profile || {};
  const certs = snap?.certificates || [];
  const accent = settings.accent_color || (() => {
    const map: Record<string, string> = { lavender: "#f87195", warm: "#c4842d", mint: "#2d9d7a", slate: "#3b82f6" };
    return map[settings.preset] || "#f87195";
  })();

  const heroBg = settings.hero.background_type === "gradient"
    ? heroGradient(settings.preset, accent)
    : settings.hero.background_type === "solid"
    ? settings.hero.background_value || "#f5f0fa"
    : "none";

  const fontsUrl = useMemo(() => {
    const families = [settings.typography.heading_font, settings.typography.body_font]
      .filter((f, i, a) => a.indexOf(f) === i)
      .map((f) => f.replace(/ /g, "+"))
      .join("&family=");
    return `https://fonts.googleapis.com/css2?family=${families}:wght@300;400;500;600;700&display=swap`;
  }, [settings.typography.heading_font, settings.typography.body_font]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <link href="${fontsUrl}" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: '${settings.typography.body_font}', sans-serif;
            background: var(--page, #f5f0fa);
            color: var(--ink, #2d1b4e);
            padding: 32px;
            -webkit-font-smoothing: antialiased;
          }
          .hero {
            background: ${heroBg};
            padding: 48px 32px;
            border-radius: 16px;
            text-align: center;
            margin-bottom: 32px;
          }
          .hero h1 {
            font-family: '${settings.typography.heading_font}', sans-serif;
            font-size: 36px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .hero .subtitle {
            color: #7b6f9a;
            font-size: 14px;
          }
          .hero .bar {
            width: 60px; height: 4px;
            background: ${accent};
            border-radius: 2px;
            margin: 16px auto 0;
          }
          .section-title {
            font-family: '${settings.typography.heading_font}', sans-serif;
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${accent}44;
          }
          .profile-card {
            background: #fcfaff;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            display: flex;
            gap: 20px;
            align-items: center;
          }
          .profile-avatar {
            width: 64px; height: 64px;
            border-radius: 50%;
            background: ${accent}22;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; color: ${accent};
            flex-shrink: 0;
          }
          .profile-info h2 { font-family: '${settings.typography.heading_font}', sans-serif; font-size: 22px; }
          .profile-info p { color: #7b6f9a; font-size: 13px; margin-top: 4px; }
          .cert-grid {
            display: grid;
            grid-template-columns: repeat(${settings.layout.cert_columns}, 1fr);
            gap: 16px;
            margin-bottom: 32px;
          }
          .cert-card {
            background: #fcfaff;
            border-radius: 12px;
            padding: 16px;
            border-left: 4px solid ${accent};
          }
          .cert-card h4 { font-family: '${settings.typography.heading_font}', sans-serif; font-size: 14px; margin-bottom: 4px; }
          .cert-card p { color: #7b6f9a; font-size: 12px; }
          .cert-card .chip {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            background: ${accent}18;
            color: ${accent};
            font-size: 11px;
            margin-top: 8px;
          }
          .footer {
            text-align: center;
            padding: 24px;
            color: #a99ec2;
            font-size: 12px;
          }
          .empty-preview {
            text-align: center;
            padding: 64px 32px;
            color: #a99ec2;
          }
        </style>
      </head>
      <body>
        <div class="hero">
          <h1>${page?.title || "ชื่อพอร์ตโฟลิโอ"}</h1>
          ${settings.hero.subtitle ? `<p class="subtitle">${settings.hero.subtitle}</p>` : ""}
          <div class="bar"></div>
        </div>

        ${settings.layout.section_order.map((section) => {
          if (section === "profile") {
            return `
              <h3 class="section-title">${sectionLabel.profile}</h3>
              <div class="profile-card">
                <div class="profile-avatar">${profile.full_name ? profile.full_name.charAt(0) : "?"}</div>
                <div class="profile-info">
                  <h2>${profile.full_name || "ชื่อผู้ใช้"}</h2>
                  <p>${[profile.school, profile.program].filter(Boolean).join(" · ") || "โรงเรียน"}</p>
                  ${profile.bio ? `<p>${profile.bio}</p>` : ""}
                </div>
              </div>
            `;
          }
          if (section === "certificates") {
            if (certs.length === 0) {
              return `<div class="empty-preview">ยังไม่มีประกาศนียบัตร</div>`;
            }
            return `
              <h3 class="section-title">${sectionLabel.certificates}</h3>
              <div class="cert-grid">
                ${certs.slice(0, 6).map((c: any) => `
                  <div class="cert-card">
                    <h4>${c.title}</h4>
                    <p>${c.issuer || "—"}</p>
                    ${c.category ? `<span class="chip">${c.category}</span>` : ""}
                  </div>
                `).join("")}
              </div>
            `;
          }
          return "";
        }).join("")}

        <div class="footer">
          พรีวิว · สร้างด้วย JunJaow Portfolio
        </div>
      </body>
      </html>
    `);
    doc.close();
  }, [settings, page, heroBg, fontsUrl, accent]);

  return (
    <div className="design-preview-wrap">
      <div className="design-preview-toolbar">
        <span className="ink-muted fz-13">พรีวิว</span>
        <span className="design-preview-dims">768 × 600</span>
      </div>
      <iframe
        ref={iframeRef}
        className="design-preview-iframe"
        title="Portfolio preview"
      />
    </div>
  );
}
