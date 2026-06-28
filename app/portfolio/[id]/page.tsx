import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortfolioView } from "./client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("portfolio_pages")
    .select("title, owner_id")
    .eq("id", id)
    .single();

  if (!data) return { title: "JunJaow Portfolio" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("owner_id", data.owner_id)
    .single();

  const name = profile?.full_name || "ผู้ใช้";
  const title = `JunJaow Portfolio — ${data.title}`;

  return {
    title,
    description: `พอร์ตโฟลิโอของ ${name} — ${data.title}`,
    openGraph: {
      title,
      description: `พอร์ตโฟลิโอของ ${name} — ${data.title}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description: `พอร์ตโฟลิโอของ ${name} — ${data.title}`,
    },
  };
}

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
