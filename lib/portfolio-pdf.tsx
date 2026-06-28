import React from "react";
import { Document, Page, View, Text, StyleSheet, Font, Image } from "@react-pdf/renderer";
import path from "path";
import fs from "fs";

const regularPath = path.join(process.cwd(), "public/fonts/Sarabun-Regular.ttf");
const boldPath = path.join(process.cwd(), "public/fonts/Sarabun-Bold.ttf");

const fontData = fs.readFileSync(regularPath);
const fontBoldData = fs.readFileSync(boldPath);

Font.register({
  family: "Sarabun",
  fonts: [
    { src: `data:font/ttf;base64,${fontData.toString("base64")}` },
    { src: `data:font/ttf;base64,${fontBoldData.toString("base64")}`, fontWeight: 700 },
  ],
});

const colors = {
  primary: "#f87195",
  text: "#1a1a2e",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#ffffff",
  tag: "#fdf2f8",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Sarabun",
    fontSize: 11,
    color: colors.text,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottom: `1 solid ${colors.border}`,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.primary,
  },
  headerMeta: {
    fontSize: 9,
    color: colors.muted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 12,
    color: colors.text,
    borderBottom: `1 solid ${colors.border}`,
    paddingBottom: 6,
  },
  profileRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.border,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: 700,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 2,
  },
  nickname: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 4,
  },
  badge: {
    fontSize: 10,
    color: colors.primary,
    marginBottom: 2,
  },
  bio: {
    fontSize: 10,
    color: colors.muted,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  contact: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    fontSize: 9,
    padding: "3 8",
    borderRadius: 4,
    backgroundColor: colors.tag,
    color: colors.text,
  },
  activityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  activity: {
    fontSize: 9,
    color: colors.muted,
  },
  certCard: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottom: `1 solid ${colors.border}`,
  },
  certRow: {
    flexDirection: "row",
    gap: 12,
  },
  certImage: {
    width: 80,
    height: 60,
    borderRadius: 4,
    backgroundColor: colors.border,
    objectFit: "cover",
  },
  certIconWrap: {
    width: 80,
    height: 60,
    borderRadius: 4,
    backgroundColor: colors.tag,
    alignItems: "center",
    justifyContent: "center",
  },
  certIconText: {
    fontSize: 20,
    color: colors.muted,
  },
  certBody: {
    flex: 1,
  },
  certTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 2,
  },
  certIssuer: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 4,
  },
  certDesc: {
    fontSize: 10,
    color: colors.muted,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  certMeta: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  certTag: {
    fontSize: 9,
    padding: "2 6",
    borderRadius: 4,
    backgroundColor: colors.tag,
    color: colors.text,
  },
  footer: {
    paddingTop: 16,
    borderTop: `1 solid ${colors.border}`,
    alignItems: "center",
  },
  footerText: {
    fontSize: 9,
    color: colors.muted,
  },
});

type PdfCert = {
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

type PdfProfile = {
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

type PdfSnapshot = {
  profile: PdfProfile | null;
  certificates: PdfCert[];
  generated_at: string;
};

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" });
}

function isImage(url: string | null, type: string | null) {
  return !!(
    type?.startsWith("image/") ||
    url?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i)
  );
}

const templateNames: Record<string, string> = {
  modern: "สมัยใหม่",
  classic: "คลาสสิก",
  timeline: "ไทม์ไลน์",
};

export function PortfolioPDF({ snapshot, title, template = "modern" }: { snapshot: PdfSnapshot; title: string; template?: string }) {
  const profile = snapshot.profile;
  const certs = snapshot.certificates || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerMeta}>
            {templateNames[template] || "สมัยใหม่"} · {certs.length} รายการ · {new Date(snapshot.generated_at).toLocaleDateString("th-TH")}
          </Text>
        </View>

        {profile && (
          <View style={styles.section}>
            <View style={styles.profileRow}>
              {profile.profile_image_url ? (
                <Image src={profile.profile_image_url} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>
                    {(profile.full_name || "?")[0]}
                  </Text>
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profile.full_name || "ไม่มีชื่อ"}</Text>
                {profile.nickname && <Text style={styles.nickname}>{profile.nickname}</Text>}
                {profile.school && <Text style={styles.badge}>{profile.school}</Text>}
                {profile.program && <Text style={styles.badge}>{profile.program}</Text>}
              </View>
            </View>

            {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

            {profile.contact && (
              <Text style={styles.contact}>
                {profile.contact.email || profile.contact.phone || profile.contact.line || ""}
              </Text>
            )}

            {profile.skills && profile.skills.length > 0 && (
              <View style={styles.tagRow}>
                {profile.skills.map((s, i) => (
                  <Text key={i} style={styles.tag}>{s}</Text>
                ))}
              </View>
            )}

            {profile.activities && profile.activities.length > 0 && (
              <View style={styles.activityRow}>
                {profile.activities.map((a, i) => (
                  <Text key={i} style={styles.activity}>• {a}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ประกาศนียบัตร</Text>

          {certs.length === 0 ? (
            <Text style={{ color: colors.muted, fontSize: 11 }}>ยังไม่มีประกาศนียบัตร</Text>
          ) : (
            certs.map((cert, i) => (
              <View key={i} style={styles.certCard}>
                <View style={styles.certRow}>
                  {cert.file_url && isImage(cert.file_url, cert.file_type) ? (
                    <Image src={cert.file_url} style={styles.certImage} />
                  ) : (
                    <View style={styles.certIconWrap}>
                      <Text style={styles.certIconText}>📄</Text>
                    </View>
                  )}
                  <View style={styles.certBody}>
                    <Text style={styles.certTitle}>{cert.title}</Text>
                    {cert.issuer && <Text style={styles.certIssuer}>{cert.issuer}</Text>}
                    {cert.description && <Text style={styles.certDesc}>{cert.description}</Text>}
                    <View style={styles.certMeta}>
                      {cert.academic_year && (
                        <Text style={styles.certTag}>ปี {cert.academic_year}</Text>
                      )}
                      {cert.issued_at && (
                        <Text style={styles.certTag}>{formatDate(cert.issued_at)}</Text>
                      )}
                    </View>
                    {cert.tags && cert.tags.length > 0 && (
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 3 }}>
                        {cert.tags.map((t, ti) => (
                          <Text key={ti} style={styles.certTag}>{t}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            สร้างด้วย JunJaow Portfolio · {new Date(snapshot.generated_at).toLocaleDateString("th-TH")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
