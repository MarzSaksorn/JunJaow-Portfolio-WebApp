"use client";

import Link from "next/link";
import { fileIcon } from "@/lib/file-icons";
import { Building, Envelope, FileArrowDown } from "@phosphor-icons/react";

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
};

function isImage(url: string | null, type: string | null) {
  return !!(
    type?.startsWith("image/") ||
    url?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i)
  );
}

function DotTag({ label }: { label: string }) {
  const colors = ["tag-pink", "tag-mint", "tag-lavender", "tag-honey", "tag-coral", "tag-clip"];
  const c = colors[label.length % colors.length];
  return <span className={`dot-tag ${c}`}>{label}</span>;
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
}

export function PortfolioView({ page }: { page: PageData }) {
  const snap = page.content_snapshot;
  const profile = snap?.profile;
  const certs = snap?.certificates || [];

  return (
    <main className="public-portfolio">
      <header className="public-portfolio-head">
        <div className="public-portfolio-head-inner">
          <div className="public-portfolio-brand">
            <Link href="/" className="binder-mark" style={{ width: 40, height: 40, fontSize: 18 }}>
              Jj
            </Link>
          </div>
          <div className="public-portfolio-meta">
            <span className="dot-tag tag-clip">{page.title}</span>
            <span className="dot-tag tag-mint">{certs.length} รายการ</span>
          </div>
        </div>
      </header>

      {profile && (
        <section className="public-portfolio-section">
          <div className="public-portfolio-avatar">
            {profile.profile_image_url ? (
              <img src={profile.profile_image_url} alt={profile.full_name || ""} />
            ) : (
              <span>{(profile.full_name || "?")[0]}</span>
            )}
          </div>
          <h1 className="public-portfolio-name">{profile.full_name || "ไม่มีชื่อ"}</h1>
          {profile.nickname && (
            <p className="public-portfolio-nickname">{profile.nickname}</p>
          )}
          <div className="public-portfolio-badges">
            {profile.school && <span className="dot-tag tag-clip">{profile.school}</span>}
            {profile.program && <span className="dot-tag tag-lavender">{profile.program}</span>}
          </div>
          {profile.bio && <p className="public-portfolio-bio">{profile.bio}</p>}
          {profile.contact && (
            <p className="public-portfolio-contact">
              <Envelope weight="duotone" size={14} />
              {profile.contact.email || profile.contact.phone || profile.contact.line || ""}
            </p>
          )}
          {profile.skills && profile.skills.length > 0 && (
            <div className="public-portfolio-tags">
              {profile.skills.map((s) => (
                <DotTag key={s} label={s} />
              ))}
            </div>
          )}
          {profile.activities && profile.activities.length > 0 && (
            <div className="public-portfolio-activities">
              {profile.activities.map((a, i) => (
                <span key={i} className="public-portfolio-activity">
                  <Building weight="duotone" size={14} />
                  {a}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="public-portfolio-section">
        <h2 className="public-portfolio-section-title">ประกาศนียบัตร</h2>
        {certs.length === 0 ? (
          <p className="public-portfolio-empty">ยังไม่มีประกาศนียบัตร</p>
        ) : (
          <div className="public-portfolio-certs">
            {certs.map((cert, i) => {
              const img = isImage(cert.file_url, cert.file_type);
              return (
                <div key={i} className="public-portfolio-cert">
                  <div className="public-portfolio-cert-media">
                    {cert.file_url && img ? (
                      <img src={cert.file_url} alt={cert.title} loading="lazy" />
                    ) : cert.file_url ? (
                      <div className="public-portfolio-cert-icon">
                        {fileIcon(cert.file_type || "")}
                      </div>
                    ) : (
                      <div className="public-portfolio-cert-icon">
                        {fileIcon("")}
                      </div>
                    )}
                  </div>
                  <div className="public-portfolio-cert-body">
                    <h3>{cert.title}</h3>
                    {cert.issuer && <p className="public-portfolio-cert-issuer">{cert.issuer}</p>}
                    {cert.description && <p className="public-portfolio-cert-desc">{cert.description}</p>}
                    {(cert.academic_year || cert.issued_at) && (
                      <div className="public-portfolio-cert-meta">
                        {cert.academic_year && (
                          <span className="dot-tag tag-clip">ปี {cert.academic_year}</span>
                        )}
                        {cert.issued_at && (
                          <span className="dot-tag tag-mint">{formatDate(cert.issued_at)}</span>
                        )}
                      </div>
                    )}
                    {cert.tags && cert.tags.length > 0 && (
                      <div className="public-portfolio-cert-tags">
                        {cert.tags.map((t) => (
                          <DotTag key={t} label={t} />
                        ))}
                      </div>
                    )}
                    {cert.file_url && (
                      <a
                        href={cert.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="public-portfolio-cert-dl"
                      >
                        <FileArrowDown weight="duotone" size={14} />
                        ดูไฟล์
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="public-portfolio-foot">
        <p>สร้างด้วย JunJaow Portfolio · {new Date(snap?.generated_at || "").toLocaleDateString("th-TH")}</p>
      </footer>
    </main>
  );
}
