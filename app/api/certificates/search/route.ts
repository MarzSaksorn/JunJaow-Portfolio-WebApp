import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q") || "";
  const year = req.nextUrl.searchParams.get("year") || "";
  const category = req.nextUrl.searchParams.get("category") || "";

  let query = supabase
    .from("certificates")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      `title.ilike.%${q}%,issuer.ilike.%${q}%,description.ilike.%${q}%,tags.cs.{${q}}`
    );
  }
  if (year) query = query.eq("academic_year", year);
  if (category) query = query.eq("category", category);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
