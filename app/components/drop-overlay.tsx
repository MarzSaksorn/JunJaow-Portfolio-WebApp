"use client";

import { useEffect, useRef, useState } from "react";
import { CloudArrowUp } from "@phosphor-icons/react";
import { getFilesFromDrop } from "@/lib/drag-drop";

interface DropOverlayProps {
  /** Called with files when the user drops them anywhere on the page. */
  onDrop: (files: File[]) => void;
}

/**
 * Full-page drag-and-drop overlay.
 *
 * Listens for file drag events on the document. When files enter the window,
 * a translucent overlay with a drop cue fades in. Drops are forwarded to
 * `onDrop` — supports both files and folders via `getFilesFromDrop`.
 */
export default function DropOverlay({ onDrop }: DropOverlayProps) {
  const [visible, setVisible] = useState(false);
  const counterRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function handleDragEnter(e: DragEvent) {
      // Only react to drags that carry files
      if (!e.dataTransfer?.types?.includes("Files")) return;

      counterRef.current += 1;
      setVisible(true);
    }

    function handleDragLeave(e: DragEvent) {
      // Only react to drags that carry files
      if (!e.dataTransfer?.types?.includes("Files")) return;

      counterRef.current -= 1;
      // Use a short delay so nested element enter/leave doesn't flicker
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (counterRef.current <= 0) {
          counterRef.current = 0;
          setVisible(false);
        }
      }, 50);
    }

    function handleDragOver(e: DragEvent) {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      e.preventDefault(); // required to allow drop
    }

    async function handleDrop(e: DragEvent) {
      e.preventDefault();
      counterRef.current = 0;
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      setVisible(false);

      if (e.dataTransfer?.items?.length) {
        const files = await getFilesFromDrop(e.dataTransfer.items);
        if (files.length > 0) onDrop(files);
      } else if (e.dataTransfer?.files?.length) {
        onDrop(Array.from(e.dataTransfer.files));
      }
    }

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [onDrop]);

  if (!visible) return null;

  return (
    <div className="drop-overlay" role="region" aria-label="วางไฟล์">
      <div className="drop-overlay-box">
        <CloudArrowUp weight="duotone" size={48} />
        <strong>วางไฟล์ที่นี่</strong>
        <p>รองรับรูปภาพ PDF และเอกสาร<br />ลากโฟลเดอร์มาทั้งโฟลเดอร์ได้</p>
      </div>
    </div>
  );
}
