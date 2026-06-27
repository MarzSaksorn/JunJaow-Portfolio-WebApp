import { createClient } from "@/lib/supabase/browser";
import type { Database } from "@/lib/supabase/types";

type ActivityAction =
  | "cert_created"
  | "cert_updated"
  | "cert_deleted"
  | "profile_updated"
  | "portfolio_created"
  | "portfolio_updated";

type TargetType = "certificate" | "profile" | "portfolio";

export async function logActivity(
  action: ActivityAction,
  targetType: TargetType,
  targetId?: string,
  details?: Record<string, unknown>
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("activity_log").insert({
    owner_id: user.id,
    action,
    target_type: targetType,
    target_id: targetId,
    details: details || {},
  });
}
