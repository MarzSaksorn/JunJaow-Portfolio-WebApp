import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { PortfolioView } from "./client";

export default async function PublicPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("portfolio_pages")
    .select("*, owner_id")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <PortfolioView page={data as any} />;
}
