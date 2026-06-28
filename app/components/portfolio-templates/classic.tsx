import { fileIcon } from "@/lib/file-icons";
import { FileArrowDown, Envelope } from "@phosphor-icons/react";
import type { TemplateProps } from "./index";

function isImage(url: string | null, type: string | null) {
  return !!(
    type?.startsWith("image/") ||
    url?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i)
  );
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
}

export function ClassicTemplate({ snapshot }: TemplateProps) {
  const profile = snapshot?.profile;
  const certs = snapshot?.certificates || [];

  return (
    <div className="classic-portfolio">
      <div className="classic-watermark">PORTFOLIO</div>

      {profile && (
        <section className="classic-section">
          <div className="classic-header">
            <div className="classic-header-avatar">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt={profile.full_name || ""} />
              ) : (
                <span>{(profile.full_name || "?")[0]}</span>
              )}
            </div>
            <div className="classic-header-info">
              <h1 className="classic-name">{profile.full_name || "ไม่มีชื่อ"}</h1>
              {profile.nickname && <p className="classic-nickname">({profile.nickname})</p>}
              {(profile.school || profile.program) && (
                <p className="classic-institution">
                  {profile.school}{profile.school && profile.program && " | "}{profile.program}
                </p>
              )}
              {profile.contact && (
                <p className="classic-contact-line">
                  <Envelope weight="duotone" size={12} />
                  {profile.contact.email || profile.contact.phone || profile.contact.line || ""}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {profile?.bio && (
        <section className="classic-section">
          <h3 className="classic-section-label">คำนำ</h3>
          <p className="classic-bio">{profile.bio}</p>
        </section>
      )}

      {profile?.skills && profile.skills.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-label">ทักษะ</h3>
          <p className="classic-inline-tags">{profile.skills.join(", ")}</p>
        </section>
      )}

      {profile?.activities && profile.activities.length > 0 && (
        <section className="classic-section">
          <h3 className="classic-section-label">กิจกรรม</h3>
          <ul className="classic-activity-list">
            {profile.activities.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="classic-section">
        <h2 className="classic-section-title">ประกาศนียบัตร</h2>
        {certs.length === 0 ? (
          <p className="classic-empty">ยังไม่มีประกาศนียบัตร</p>
        ) : (
          <div className="classic-certs">
            {certs.map((cert, i) => {
              const img = isImage(cert.file_url, cert.file_type);
              return (
                <div key={i} className="classic-cert">
                  <div className="classic-cert-seal">{String(i + 1).padStart(2, "0")}</div>
                  <div className="classic-cert-body">
                    <h3 className="classic-cert-title">{cert.title}</h3>
                    {cert.issuer && <p className="classic-cert-issuer">ออกโดย {cert.issuer}</p>}
                    {cert.description && <p className="classic-cert-desc">{cert.description}</p>}
                    <div className="classic-cert-foot">
                      {(cert.academic_year || cert.issued_at) && (
                        <span className="classic-cert-date">
                          {cert.academic_year && `ปีการศึกษา ${cert.academic_year}`}
                          {cert.academic_year && cert.issued_at && " · "}
                          {cert.issued_at && formatDate(cert.issued_at)}
                        </span>
                      )}
                      {cert.file_url && (
                        <a
                          href={cert.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="classic-cert-dl"
                        >
                          <FileArrowDown weight="duotone" size={11} />
                          เอกสารแนบ
                        </a>
                      )}
                    </div>
                    {cert.tags && cert.tags.length > 0 && (
                      <div className="classic-cert-tags">
                        {cert.tags.map((t, ti) => (
                          <span key={ti} className="classic-tag-sm">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {cert.file_url && img && (
                    <div className="classic-cert-stamp">
                      <img src={cert.file_url} alt={cert.title} loading="lazy" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
