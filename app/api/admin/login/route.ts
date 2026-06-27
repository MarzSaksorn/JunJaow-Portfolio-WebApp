import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAdminSession } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: rows } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "admin_password_hash")
      .single();

    let storedHash = rows?.value as string | null;

    if (!storedHash) {
      const hash = await bcrypt.hash(password, 10);
      await supabase
        .from("admin_settings")
        .upsert({ key: "admin_password_hash", value: hash }, { onConflict: "key" });
      storedHash = hash;
    }

    const valid = await bcrypt.compare(password, storedHash);
    if (!valid) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    await createAdminSession();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
