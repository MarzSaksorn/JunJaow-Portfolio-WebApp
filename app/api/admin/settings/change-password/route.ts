import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "กรุณากรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่" }, { status: 400 });
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ error: "รหัสผ่านใหม่อย่างน้อย 4 ตัวอักษร" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: rows } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password_hash")
      .single();

    const storedHash = rows?.value as string | null;
    if (!storedHash) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งรหัสผ่านเริ่มต้น" }, { status: 400 });
    }

    const valid = await bcrypt.compare(currentPassword, storedHash);
    if (!valid) {
      return NextResponse.json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, { status: 401 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await supabase
      .from("admin_settings")
      .upsert({ key: "admin_password_hash", value: newHash }, { onConflict: "key" });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
