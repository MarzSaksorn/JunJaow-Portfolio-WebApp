"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { usePageEntrance } from "@/hooks/use-page-entrance";

import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ProfilePage() {
  const rootRef = usePageEntrance<HTMLDivElement>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    nickname: "",
    school: "",
    program: "",
    bio: "",
    skills: "",
    activities: "",
    contact_email: "",
    contact_phone: "",
    contact_line: "",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (profile) {
        setForm({
          full_name: profile.full_name || "",
          nickname: profile.nickname || "",
          school: profile.school || "",
          program: profile.program || "",
          bio: profile.bio || "",
          skills: (profile.skills || []).join(", "),
          activities: (profile.activities || []).join(", "),
          contact_email: (profile.contact as any)?.email || "",
          contact_phone: (profile.contact as any)?.phone || "",
          contact_line: (profile.contact as any)?.line || "",
        });
        if (profile.profile_image_url) {
          setProfileImagePreview(profile.profile_image_url);
        }
      }
    }
    load();
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("ไม่ได้เข้าสู่ระบบ");
      setLoading(false);
      return;
    }

    let profileImageUrl = profileImagePreview;
    let profileImagePath = "";

    if (profileImage) {
      profileImagePath = `${user.id}/profile_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("certificate-files")
        .upload(profileImagePath, profileImage);

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("certificate-files")
        .getPublicUrl(profileImagePath);
      profileImageUrl = urlData.publicUrl;
    }

    const skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    const activities = form.activities.split(",").map((a) => a.trim()).filter(Boolean);

    const profileData = {
      full_name: form.full_name,
      nickname: form.nickname,
      school: form.school,
      program: form.program,
      bio: form.bio,
      skills,
      activities,
      contact: {
        email: form.contact_email,
        phone: form.contact_phone,
        line: form.contact_line,
      },
      profile_image_url: profileImageUrl,
      profile_image_path: profileImagePath,
    };

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (existing) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("owner_id", user.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({ ...profileData, owner_id: user.id });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  }

  return (
    <div ref={rootRef}>
      <header className="ws-header" data-animate="fade-up" data-order="1">
        <div>
          <p className="ws-eyebrow">แหล่งข้อมูล</p>
          <h1>ข้อมูลส่วนตัว</h1>
        </div>
      </header>

      <div className="ws-body">
        <form className="form-card" onSubmit={handleSubmit} data-animate="fade-up" data-order="2">
          {error && <p className="form-error">{error}</p>}

          <div className="profile-head">
            {profileImagePreview ? (
              <img src={profileImagePreview} alt="รูปโปรไฟล์" className="profile-avatar" loading="lazy" />
            ) : (
              <div className="profile-avatar-placeholder">รูป</div>
            )}
            <label className="file-upload">
              <span className="btn btn-secondary btn-sm">เปลี่ยนรูปภาพ</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfileImage(file);
                    setProfileImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          </div>

          <div className="form-grid">
            <div className="form-col">
              <div className="form-field" data-animate-stagger>
                <label>ชื่อ-นามสกุล</label>
                <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="ชื่อ นามสกุล" />
              </div>
              <div className="form-field" data-animate-stagger>
                <label>ชื่อเล่น</label>
                <input name="nickname" value={form.nickname} onChange={handleChange} placeholder="ชื่อเล่น" />
              </div>
              <div className="form-field" data-animate-stagger>
                <label>โรงเรียน</label>
                <input name="school" value={form.school} onChange={handleChange} placeholder="ชื่อโรงเรียน" />
              </div>
              <div className="form-field" data-animate-stagger>
                <label>แผนการเรียน</label>
                <input name="program" value={form.program} onChange={handleChange} placeholder="เช่น วิทย์-คณิต" />
              </div>
              <div className="form-field" data-animate-stagger>
                <label>ประวัติย่อ</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="สรุปประวัติส่วนตัว" />
              </div>
            </div>

            <div className="form-col">
              <div className="form-field" data-animate-stagger>
                <label>ทักษะ (คั่นด้วยคอมม่า)</label>
                <input name="skills" value={form.skills} onChange={handleChange} placeholder="พูดในที่สาธารณะ, ภาวะผู้นำ" />
              </div>
              <div className="form-field" data-animate-stagger>
                <label>กิจกรรม (คั่นด้วยคอมม่า)</label>
                <input name="activities" value={form.activities} onChange={handleChange} placeholder="อาสาสมัคร, ชมรมวิทยาศาสตร์" />
              </div>
              <div className="form-field" data-animate-stagger>
                <label>อีเมล</label>
                <input name="contact_email" type="email" value={form.contact_email} onChange={handleChange} placeholder="email@example.com" />
              </div>
              <div className="form-field" data-animate-stagger>
                <label>เบอร์โทรศัพท์</label>
                <input name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="เช่น 081..." />
              </div>
              <div className="form-field" data-animate-stagger>
                <label>ไลน์ไอดี</label>
                <input name="contact_line" value={form.contact_line} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
