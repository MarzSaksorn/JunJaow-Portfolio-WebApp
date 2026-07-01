/**
 * Recursively walk a FileSystemDirectoryEntry and yield all files.
 * Falls back to the flat file list for browsers that don't support the Entry API.
 */
export async function getFilesFromDrop(items: DataTransferItemList): Promise<File[]> {
  const files: File[] = [];
  const queue: FileSystemEntry[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const entry = item.webkitGetAsEntry?.();
    if (entry) {
      queue.push(entry);
    } else if (item.kind === "file") {
      const file = item.getAsFile();
      if (file) files.push(file);
    }
  }

  while (queue.length > 0) {
    const entry = queue.shift()!;
    if (entry.isFile) {
      const file = await new Promise<File | null>((resolve) =>
        (entry as FileSystemFileEntry).file(resolve, () => resolve(null)),
      );
      if (file) files.push(file);
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      const children = await new Promise<FileSystemEntry[]>((resolve) =>
        reader.readEntries(resolve, () => resolve([])),
      );
      queue.push(...children);
    }
  }

  return files;
}

/** Convenience: create drag-over/drag-leave/drop handlers for a drop zone. */
export function createDropHandlers(onDrop: (files: File[]) => void) {
  let dragCounter = 0;

  return {
    /** Attach to onDragEnter on the drop zone wrapper. */
    onDragEnter: () => {
      dragCounter++;
    },

    /** Attach to onDragLeave on the drop zone wrapper — only fires when counter reaches 0. */
    onDragLeave: () => {
      dragCounter--;
    },

    /** Attach to onDragOver — must call e.preventDefault() to allow drop. */
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },

    /** Attach to onDrop — extracts files and resets counter. */
    onDrop: async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter = 0;

      if (e.dataTransfer?.items?.length) {
        const files = await getFilesFromDrop(e.dataTransfer.items);
        if (files.length > 0) onDrop(files);
      } else if (e.dataTransfer?.files?.length) {
        onDrop(Array.from(e.dataTransfer.files));
      }
    },
  };
}
