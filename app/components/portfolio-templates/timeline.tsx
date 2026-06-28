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

function yearFromCert(cert: { academic_year: string | null; issued_at: string | null }) {
  if (cert.academic_year) return cert.academic_year;
  if (cert.issued_at) return new Date(cert.issued_at).getFullYear().toString();
  return "อื่นๆ";
}

export function TimelineTemplate({ snapshot }: TemplateProps) {
  const profile = snapshot?.profile;
  const certs = snapshot?.certificates || [];

  const grouped: Record<string, typeof certs> = {};
  for (const cert of certs) {
    const y = yearFromCert(cert);
    if (!grouped[y]) grouped[y] = [];
    grouped[y].push(cert);
  }

  const years = Object.keys(grouped).sort((a, b) => {
    const an = parseInt(a);
    const bn = parseInt(b);
    if (!isNaN(an) && !isNaN(bn)) return bn - an;
    return a.localeCompare(b);
  });

  return (
    <div className="timeline-portfolio">
      {profile && (
        <section className="timeline-card timeline-profile-card">
          <div className="timeline-card-bg" />
          <div className="timeline-profile-inner">
            <div className="timeline-avatar">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt={profile.full_name || ""} />
              ) : (
                <span>{(profile.full_name || "?")[0]}</span>
              )}
            </div>
            <div className="timeline-profile-body">
              <h1 className="timeline-name">{profile.full_name || "ไม่มีชื่อ"}</h1>
              {profile.nickname && <p className="timeline-nickname">{profile.nickname}</p>}
              {(profile.school || profile.program) && (
                <p className="timeline-school">
                  {profile.school}{profile.school && profile.program && " · "}{profile.program}
                </p>
              )}
              {profile.bio && <p className="timeline-bio-text">{profile.bio}</p>}
              {profile.contact && (
                <p className="timeline-contact">
                  <Envelope weight="duotone" size={12} />
                  {profile.contact.email || profile.contact.phone || profile.contact.line || ""}
                </p>
              )}
              {profile.skills && profile.skills.length > 0 && (
                <div className="timeline-skills">
                  {profile.skills.map((s, i) => (
                    <span key={i} className="timeline-skill">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="timeline-certs-section">
        <h2 className="timeline-certs-title">เส้นเวลาประกาศนียบัตร</h2>
        {certs.length === 0 ? (
          <p className="timeline-empty">ยังไม่มีประกาศนียบัตร</p>
        ) : (
          <div className="timeline-track">
            {years.map((year) => (
              <div key={year} className="timeline-era">
                <div className="timeline-era-head">
                  <span className="timeline-era-dot" />
                  <span className="timeline-era-label">{year}</span>
                </div>
                <div className="timeline-era-certs">
                  {grouped[year].map((cert, i) => {
                    const img = isImage(cert.file_url, cert.file_type);
                    return (
                      <div key={i} className="timeline-chapter">
                        <div className="timeline-chapter-media">
                          {cert.file_url && img ? (
                            <img src={cert.file_url} alt={cert.title} loading="lazy" />
                          ) : (
                            <div className="timeline-chapter-icon">
                              {fileIcon(cert.file_type || "")}
                            </div>
                          )}
                        </div>
                        <div className="timeline-chapter-body">
                          <h3 className="timeline-chapter-title">{cert.title}</h3>
                          {cert.issuer && <p className="timeline-chapter-issuer">{cert.issuer}</p>}
                          {cert.description && <p className="timeline-chapter-desc">{cert.description}</p>}
                          <div className="timeline-chapter-meta">
                            {cert.issued_at && (
                              <span className="timeline-chapter-date">{formatDate(cert.issued_at)}</span>
                            )}
                            {cert.file_url && (
                              <a
                                href={cert.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="timeline-chapter-dl"
                              >
                                <FileArrowDown weight="duotone" size={11} />
                                ไฟล์
                              </a>
                            )}
                          </div>
                          {cert.tags && cert.tags.length > 0 && (
                            <div className="timeline-chapter-tags">
                              {cert.tags.map((t, ti) => (
                                <span key={ti} className="timeline-chapter-tag">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
