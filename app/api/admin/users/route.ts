import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET() {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();

    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const { data: certCounts } = await supabase
      .from("certificates")
      .select("owner_id");

    const { data: profileCounts } = await supabase
      .from("profiles")
      .select("owner_id");

    const certMap: Record<string, number> = {};
    certCounts?.forEach((c) => {
      certMap[c.owner_id] = (certMap[c.owner_id] || 0) + 1;
    });

    const profileSet = new Set(profileCounts?.map((p) => p.owner_id) || []);

    const users = authUsers.users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      disabled: !!(u.user_metadata as any)?.disabled,
      last_sign_in_at: u.last_sign_in_at,
      certificate_count: certMap[u.id] || 0,
      has_profile: profileSet.has(u.id),
    }));

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Admin list users error:", err);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: { id: data.user.id, email: data.user.email } });
  } catch (err) {
    console.error("Admin create user error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
