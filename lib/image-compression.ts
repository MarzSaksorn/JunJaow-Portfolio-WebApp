export interface CompressionOptions {
  /** Max width in px (default 1920). The image is scaled down to fit within these bounds while preserving aspect ratio. */
  maxWidth?: number;
  /** Max height in px (default 1920). */
  maxHeight?: number;
  /** JPEG/webp quality 0-1 (default 0.82). */
  quality?: number;
  /** Output MIME type (default "image/jpeg"). */
  outputType?: string;
}

export interface CompressionResult {
  /** The compressed file (or original if skipped). */
  file: File;
  /** Original file size in bytes. */
  originalSize: number;
  /** Compressed file size in bytes. */
  compressedSize: number;
  /** Percentage savings (0–100). */
  savingsPercent: number;
  /** True when the file was not an image and was left as-is. */
  skipped: boolean;
}

/** Friendly label like "2.4 MB → 640 KB (↓73%)" */
export function compressionLabel(r: CompressionResult): string {
  if (r.skipped) return formatSize(r.originalSize);
  return `${formatSize(r.originalSize)} → ${formatSize(r.compressedSize)} (↓${r.savingsPercent}%)`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Client-side image compression using Canvas API.
 *
 * - Scales down images larger than maxWidth × maxHeight while preserving aspect ratio.
 * - Re-encodes as JPEG or webp at the given quality.
 * - Skips non-image files, GIFs (preserve animation), and files that would end up larger.
 */
export async function compressImage(
  file: File,
  options?: CompressionOptions,
): Promise<CompressionResult> {
  const maxWidth = options?.maxWidth ?? 1920;
  const maxHeight = options?.maxHeight ?? 1920;
  const quality = options?.quality ?? 0.82;
  const outputType = options?.outputType ?? "image/jpeg";

  // ── Skip non-images and animated GIFs ──
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return { file, originalSize: file.size, compressedSize: file.size, savingsPercent: 0, skipped: true };
  }

  try {
    const img = await createImageBitmap(file);

    // ── Compute new dimensions ──
    let { width, height } = img;
    if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
    if (height > maxHeight) { width = (width * maxHeight) / height; height = maxHeight; }

    // Skip if the image is already small enough that resizing won't help
    if (width >= img.width && height >= img.height && file.type === outputType) {
      img.close();
      return { file, originalSize: file.size, compressedSize: file.size, savingsPercent: 0, skipped: true };
    }

    // ── Draw onto canvas and export ──
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality));
    if (!blob) {
      return { file, originalSize: file.size, compressedSize: file.size, savingsPercent: 0, skipped: true };
    }

    // Derive a sensible filename for the new format
    const ext = outputType === "image/jpeg" ? "jpg" : outputType.split("/")[1] || "jpg";
    const newName = file.name.replace(/\.[^.]+$/, `.${ext}`);

    const compressed = new File([blob], newName, { type: outputType });
    const savingsPercent = Math.round((1 - compressed.size / file.size) * 100);

    // Don't return a *larger* file
    if (compressed.size >= file.size) {
      return { file, originalSize: file.size, compressedSize: file.size, savingsPercent: 0, skipped: true };
    }

    return {
      file: compressed,
      originalSize: file.size,
      compressedSize: compressed.size,
      savingsPercent,
      skipped: false,
    };
  } catch {
    // If anything fails (CORS tainted canvas, unsupported format), return original
    return { file, originalSize: file.size, compressedSize: file.size, savingsPercent: 0, skipped: true };
  }
}
