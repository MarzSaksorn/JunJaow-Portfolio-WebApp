"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

interface IssuerInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function IssuerInput({ value, onChange, placeholder }: IssuerInputProps) {
  const [existingIssuers, setExistingIssuers] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("certificates")
        .select("issuer")
        .eq("owner_id", user.id)
        .not("issuer", "is", null)
        .then(({ data }) => {
          const all = new Set<string>();
          data?.forEach((row) => {
            if (row.issuer) all.add(row.issuer);
          });
          setExistingIssuers(Array.from(all).sort());
        });
    });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = value
    ? existingIssuers.filter(
        (iss) => iss.toLowerCase().includes(value.toLowerCase()) && iss !== value,
      )
    : existingIssuers;

  return (
    <div className="issuer-input-wrap" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder || "องค์กรหรือสถาบัน"}
        autoComplete="off"
      />
      {showSuggestions && filtered.length > 0 && (
        <div className="tag-suggestions">
          {filtered.slice(0, 8).map((iss) => (
            <button
              key={iss}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(iss);
                setShowSuggestions(false);
              }}
            >
              {iss}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
