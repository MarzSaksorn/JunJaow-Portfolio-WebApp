"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useEntranceAnimation } from "@/lib/animations";

export default function LoginPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useEntranceAnimation(rootRef);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    let result;

    if (mode === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
      if (!result.error) {
        setError("สร้างบัญชีแล้ว ตรวจสอบอีเมลเพื่อยืนยัน");
        setLoading(false);
        return;
      }
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <main className="login-page" ref={rootRef}>
      <div className="login-card" data-entrance-scale>
        <div className="login-header">
          <div className="binder-mark" style={{ width: 48, height: 48, fontSize: 22 }}>Jj</div>
          <h1>โต๊ะพอร์ตโฟลิโอ</h1>
          <p className="ws-eyebrow" style={{ textAlign: "center" }}>พื้นที่ส่วนตัวของ Jj</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} data-entrance-form>
          <div className="form-field">
            <label>อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jj@example.com"
              required
            />
          </div>

          <div className="form-field">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
            {loading
              ? "โปรดรอ..."
              : mode === "login"
                ? "เข้าใช้งาน"
                : "สมัครสมาชิก"}
          </button>
        </form>

        <button
          className="login-switch"
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
        >
          {mode === "login" ? "ยังไม่มีบัญชี? สมัครสมาชิก" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
        </button>
      </div>
    </main>
  );
}
