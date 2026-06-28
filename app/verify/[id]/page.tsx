import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CertificateVerify } from "./client";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("certificates")
    .select("title, issuer, description, file_url, file_type")
    .eq("id", id)
    .single();

  if (!data) return { title: "ไม่พบประกาศนียบัตร" };

  const isImage = data.file_type?.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(data.file_url || "");
  const title = `JunJaow — ${data.title}`;

  return {
    title,
    description: data.description || `ประกาศนียบัตรโดย ${data.issuer || "ผู้ออก"}`,
    openGraph: {
      title,
      description: data.description || `ประกาศนียบัตรโดย ${data.issuer || "ผู้ออก"}`,
      type: "article",
      ...(isImage && data.file_url ? { images: [{ url: data.file_url, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: isImage ? "summary_large_image" : "summary",
      title,
      description: data.description || `ประกาศนียบัตรโดย ${data.issuer || "ผู้ออก"}`,
      ...(isImage && data.file_url ? { images: [data.file_url] } : {}),
    },
  };
}

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <CertificateVerify certificate={data as any} />;
}
