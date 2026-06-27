"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ width: 36, height: 36 }} />;

  return (
    <button
      className="binder-theme"
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "เปิดโหมดสว่าง" : "เปิดโหมดมืด"}
    >
      {theme === "dark" ? <Sun weight="duotone" /> : <Moon weight="duotone" />}
    </button>
  );
}
