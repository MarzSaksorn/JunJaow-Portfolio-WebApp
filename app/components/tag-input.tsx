"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { X } from "@phosphor-icons/react";

interface TagInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("certificates")
        .select("tags")
        .eq("owner_id", user.id)
        .then(({ data }) => {
          const all = new Set<string>();
          data?.forEach((row) => (row.tags as string[])?.forEach((t) => all.add(t)));
          setExistingTags(Array.from(all).sort());
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

  const tags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const currentInput = tags[tags.length - 1] || "";

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !currentInput && tags.length > 1) {
      onChange(tags.slice(0, -1).join(", ") + ", ");
    }
  }

  function addTag(tag: string) {
    const newTags = [...tags.slice(0, -1), tag, ""];
    onChange(newTags.join(", ") + ", ");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function removeTag(idx: number) {
    const newTags = tags.filter((_, i) => i !== idx);
    onChange(newTags.join(", ") + (newTags.length > 0 ? ", " : ""));
  }

  function handleInputChange(val: string) {
    onChange(val);
    if (val.endsWith(",") || val.endsWith(" ")) {
      const lastTag = val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .pop();
      if (lastTag && existingTags.includes(lastTag)) {
        setShowSuggestions(false);
      }
    }
  }

  const filteredSuggestions = currentInput
    ? existingTags.filter(
        (t) =>
          t.toLowerCase().includes(currentInput.toLowerCase()) &&
          !tags.includes(t),
      )
    : [];

  return (
    <div className="tag-input-wrap" ref={wrapperRef}>
      <div className="tag-input-field">
        {tags.map((tag, i) => (
          <span key={i} className="tag-chip">
            {tag}
            <button type="button" onClick={() => removeTag(i)}>
              <X weight="bold" size={12} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={value.endsWith(",") || value.endsWith(", ") ? "" : currentInput}
          onChange={(e) => {
            const parts = value.split(",");
            parts[parts.length - 1] = e.target.value;
            handleInputChange(parts.join(","));
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? (placeholder || "แท็ก (คั่นด้วยจุลภาค)") : ""}
        />
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="tag-suggestions">
          {filteredSuggestions.slice(0, 8).map((s) => (
            <button key={s} type="button" onClick={() => addTag(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
