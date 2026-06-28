import { fileIcon } from "@/lib/file-icons";
import { Building, Envelope, FileArrowDown } from "@phosphor-icons/react";
import type { TemplateProps } from "./index";

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

export function ModernTemplate({ snapshot }: TemplateProps) {
  const profile = snapshot?.profile;
  const certs = snapshot?.certificates || [];
  const sec = snapshot?.sections || { skills: true, activities: true, contact: true, bio: true };

  return (
    <div className="modern-portfolio">
      {profile && (
        <section className="modern-section modern-profile-section">
          <div className="modern-avatar">
            {profile.profile_image_url ? (
              <img src={profile.profile_image_url} alt={profile.full_name || ""} />
            ) : (
              <span>{(profile.full_name || "?")[0]}</span>
            )}
          </div>
          <h1 className="modern-name">{profile.full_name || "ไม่มีชื่อ"}</h1>
          {profile.nickname && <p className="modern-nickname">{profile.nickname}</p>}
          <div className="modern-badges">
            {profile.school && <span className="dot-tag tag-clip">{profile.school}</span>}
            {profile.program && <span className="dot-tag tag-lavender">{profile.program}</span>}
          </div>
          {sec.bio && profile.bio && <p className="modern-bio">{profile.bio}</p>}
          {sec.contact && profile.contact && (
            <p className="modern-contact">
              <Envelope weight="duotone" size={14} />
              {profile.contact.email || profile.contact.phone || profile.contact.line || ""}
            </p>
          )}
          {sec.skills && profile.skills && profile.skills.length > 0 && (
            <div className="modern-tags">
              {profile.skills.map((s) => (
                <DotTag key={s} label={s} />
              ))}
            </div>
          )}
          {sec.activities && profile.activities && profile.activities.length > 0 && (
            <div className="modern-activities">
              {profile.activities.map((a, i) => (
                <span key={i} className="modern-activity">
                  <Building weight="duotone" size={14} />
                  {a}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="modern-section">
        <h2 className="modern-section-title">ประกาศนียบัตร</h2>
        {certs.length === 0 ? (
          <p className="modern-empty">ยังไม่มีประกาศนียบัตร</p>
        ) : (
          <div className="modern-certs">
            {certs.map((cert, i) => {
              const img = isImage(cert.file_url, cert.file_type);
              return (
                <div key={i} className="modern-cert">
                  <div className="modern-cert-media">
                    {cert.file_url && img ? (
                      <img src={cert.file_url} alt={cert.title} loading="lazy" />
                    ) : cert.file_url ? (
                      <div className="modern-cert-icon">
                        {fileIcon(cert.file_type || "")}
                      </div>
                    ) : (
                      <div className="modern-cert-icon">
                        {fileIcon("")}
                      </div>
                    )}
                  </div>
                  <div className="modern-cert-body">
                    <h3>{cert.title}</h3>
                    {cert.issuer && <p className="modern-cert-issuer">{cert.issuer}</p>}
                    {cert.description && <p className="modern-cert-desc">{cert.description}</p>}
                    {(cert.academic_year || cert.issued_at) && (
                      <div className="modern-cert-meta">
                        {cert.academic_year && (
                          <span className="dot-tag tag-clip">ปี {cert.academic_year}</span>
                        )}
                        {cert.issued_at && (
                          <span className="dot-tag tag-mint">{formatDate(cert.issued_at)}</span>
                        )}
                      </div>
                    )}
                    {cert.tags && cert.tags.length > 0 && (
                      <div className="modern-cert-tags">
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
                        className="modern-cert-dl"
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
    </div>
  );
}
