import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [total, recent, yearsRes, portfolioRes, profileRes] = await Promise.all([
    supabase.from("certificates").select("*", { count: "exact", head: true }).eq("owner_id", user.id),
    supabase.from("certificates").select("*", { count: "exact", head: true }).eq("owner_id", user.id).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from("certificates").select("academic_year").eq("owner_id", user.id).not("academic_year", "is", null),
    supabase.from("portfolio_pages").select("*", { count: "exact", head: true }).eq("owner_id", user.id),
    supabase.from("profiles").select("*").eq("owner_id", user.id).single(),
  ]);

  const yearCounts: Record<string, number> = {};
  yearsRes.data?.forEach((c) => {
    if (c.academic_year) yearCounts[c.academic_year] = (yearCounts[c.academic_year] || 0) + 1;
  });

  const profile = profileRes.data;
  const profileCompletion = profile
    ? [profile.full_name, profile.school, profile.bio, (profile.skills?.length || 0) > 0, (profile.activities?.length || 0) > 0].filter(Boolean).length * 20
    : 0;

  return NextResponse.json({
    totalCertificates: total.count || 0,
    recentCount: recent.count || 0,
    yearCounts,
    portfolioCount: portfolioRes.count || 0,
    profileCompletion,
  });
}
