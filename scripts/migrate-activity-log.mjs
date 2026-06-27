import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "..", ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const sql = readFileSync(resolve(__dirname, "..", "supabase", "migrations", "20260627_create_activity_log.sql"), "utf-8");

// Execute SQL via Supabase's REST endpoint with service_role
const { error } = await supabase.rpc("exec_sql", { sql }).single();

if (error) {
  // The rpc might not exist; try raw query approach
  console.log("RPC method failed, trying direct SQL execution...");
  
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceRoleKey,
      "Authorization": `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("SQL execution failed:", text);
    process.exit(1);
  }
  console.log("Migration applied successfully via REST");
} else {
  console.log("Migration applied successfully via RPC");
}
