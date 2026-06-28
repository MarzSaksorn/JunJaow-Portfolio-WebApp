export type TemplateType = "modern" | "classic" | "timeline";

export const TEMPLATES: {
  id: TemplateType;
  name: string;
  desc: string;
}[] = [
  { id: "modern", name: "สมัยใหม่", desc: "ดีไซน์สะอาดตา โทนชมพู-ลาเวนเดอร์ จัดกึ่งกลาง" },
  { id: "classic", name: "คลาสสิก", desc: "รูปแบบเอกสารทางการ โทนอบอุ่น-กระดาษ มีรอยประทับ" },
  { id: "timeline", name: "ไทม์ไลน์", desc: "เส้นเวลาเรียงตามปี โทนฟ้า-สเลท การ์ดโปรไฟล์" },
];

export type SnapshotCert = {
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

export type SnapshotProfile = {
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

export type Snapshot = {
  profile: SnapshotProfile | null;
  certificates: SnapshotCert[];
  generated_at: string;
};

export type TemplateProps = {
  snapshot: Snapshot;
  title: string;
};

export { ModernTemplate } from "./modern";
export { ClassicTemplate } from "./classic";
export { TimelineTemplate } from "./timeline";
