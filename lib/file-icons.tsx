import {
  FilePdf,
  FileImage,
  FileDoc,
  FileXls,
  FilePpt,
  FileArchive,
  FileText,
  File,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";

export type FileCategory = "pdf" | "image" | "doc" | "sheet" | "slide" | "archive" | "text" | "other";

export function categorizeFile(type: string): FileCategory {
  const t = (type || "").toUpperCase();
  if (t.includes("PDF") || type.endsWith(".pdf")) return "pdf";
  if (
    t.includes("IMAGE") ||
    t.includes("PNG") ||
    t.includes("JPG") ||
    t.includes("JPEG") ||
    t.includes("WEBP") ||
    t.includes("GIF") ||
    t.includes("SVG") ||
    t.includes("BMP") ||
    t.includes("AVIF") ||
    type.endsWith(".jpg") ||
    type.endsWith(".jpeg") ||
    type.endsWith(".png")
  ) return "image";
  if (t.includes("DOC") || t.includes("WORD") || t.includes("OCTET-STREAM") || type.endsWith(".doc") || type.endsWith(".docx"))
    return "doc";
  if (t.includes("XLS") || t.includes("EXCEL") || t.includes("SPREADSHEET") || t.includes("CSV") || type.endsWith(".xls") || type.endsWith(".xlsx"))
    return "sheet";
  if (t.includes("PPT") || t.includes("POWERPOINT") || t.includes("PRESENTATION") || type.endsWith(".ppt") || type.endsWith(".pptx"))
    return "slide";
  if (t.includes("ZIP") || t.includes("RAR") || t.includes("GZIP") || t.includes("TAR") || t.includes("7Z") || t.includes("7-ZIP") || type.endsWith(".zip") || type.endsWith(".rar"))
    return "archive";
  if (t.includes("TEXT") || t.includes("PLAIN"))
    return "text";
  return "other";
}

export function fileIcon(type: string, large?: boolean): ReactNode {
  const size = large ? 32 : 20;
  const cat = categorizeFile(type);
  switch (cat) {
    case "pdf": return <FilePdf weight="duotone" size={size} />;
    case "image": return <FileImage weight="duotone" size={size} />;
    case "doc": return <FileDoc weight="duotone" size={size} />;
    case "sheet": return <FileXls weight="duotone" size={size} />;
    case "slide": return <FilePpt weight="duotone" size={size} />;
    case "archive": return <FileArchive weight="duotone" size={size} />;
    case "text": return <FileText weight="duotone" size={size} />;
    default: return <File weight="duotone" size={size} />;
  }
}

export function iconClass(type: string): string {
  const cat = categorizeFile(type);
  if (cat === "slide") return "pdf";
  return cat;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
