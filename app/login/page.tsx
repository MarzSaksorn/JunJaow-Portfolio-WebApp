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
        setError("สมัครสมาชิกสำเร็จ");
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
    <main className="login-page" id="main-content" ref={rootRef}>
      <div className="login-card" data-entrance-scale>
        <div className="login-card-clip" />

        <div className="login-header">
          <div className="login-emblem">Jj</div>
          <h1>โต๊ะพอร์ตโฟลิโอ</h1>
          <p className="login-subtitle">พื้นที่ส่วนตัวของคุณ</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} data-entrance-form>
          <div className="login-field">
            <label htmlFor="email">อีเมล</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jj@example.com"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit" type="submit" disabled={loading}>
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

        <button
          className="login-fill-btn"
          type="button"
          onClick={() => { setEmail("jj@gmail.com"); setPassword("aaaaaa"); }}
        >
          {"กดตรงนี้นะคับเธอ~~"}
        </button>
      </div>
    </main>
  );
}
