"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Sidebar } from "@/app/components/sidebar";
import { applyPreset, getSavedPreset } from "@/lib/color-themes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    applyPreset(getSavedPreset());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        router.push("/login");
        return;
      }
      setAuthed(true);
    }
    check();
    return () => { cancelled = true; };
  }, [router]);

  if (!authed) return null;

  return (
    <main className="app-shell" id="main-content">
      <Sidebar />
      <section className="workspace">{children}</section>
    </main>
  );
}
