import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { CertificateVerify } from "./client";

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
