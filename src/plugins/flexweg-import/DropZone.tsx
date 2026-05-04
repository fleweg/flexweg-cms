// Drag-and-drop import zone. Accepts .md / .xml files at the root
// plus arbitrary image files (or a folder containing both); the
// caller turns that into an ImportBundle and feeds the standard
// scan/run pipeline.
//
// Browser API surface used:
//   • DataTransferItem.getAsFileSystemHandle() (Chrome 86+, Edge,
//     Opera) for folder drops on capable browsers.
//   • Falls back to .webkitGetAsEntry() (Chrome / Firefox / Safari)
//     for the same use case where the new API isn't available.
//   • Plain DataTransfer.files for the simple flat-files case
//     (Safari < TP, older Firefox) — folders silently ignored
//     there.

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";
import type { ImageInput, SourceFileInput } from "./importer";

export interface DroppedBundle {
  markdown: SourceFileInput[];
  xml: SourceFileInput[];
  images: ImageInput[];
  // Files that don't match any supported kind. Surfaced so the UI
  // can warn the user (typo'd extension, accidental drop).
  ignored: string[];
}

interface DropZoneProps {
  // Called every time the user drops something. The component
  // doesn't keep state across drops — the parent owns the
  // accumulated bundle.
  onDropped: (bundle: DroppedBundle) => void;
  disabled?: boolean;
}

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "svg", "gif"]);

function classifyFile(filename: string): "markdown" | "xml" | "image" | null {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "md") return "markdown";
  if (ext === "xml") return "xml";
  if (IMAGE_EXTS.has(ext)) return "image";
  return null;
}

// Recursively walks a FileSystemEntry tree (the result of
// .webkitGetAsEntry()) yielding every file. Folders contribute
// their contents — depth is unbounded but exports rarely nest
// beyond 2 levels.
async function walkEntry(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) {
    return new Promise((resolve, reject) => {
      (entry as FileSystemFileEntry).file(
        (file) => resolve([file]),
        (err) => reject(err),
      );
    });
  }
  if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    // readEntries reads in batches; loop until we get an empty batch.
    const all: File[] = [];
    for (;;) {
      const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
        reader.readEntries((entries) => resolve(entries), (err) => reject(err));
      });
      if (batch.length === 0) break;
      for (const sub of batch) {
        all.push(...(await walkEntry(sub)));
      }
    }
    return all;
  }
  return [];
}

async function bundleFromFiles(files: File[]): Promise<DroppedBundle> {
  const markdown: SourceFileInput[] = [];
  const xml: SourceFileInput[] = [];
  const images: ImageInput[] = [];
  const ignored: string[] = [];
  for (const file of files) {
    const kind = classifyFile(file.name);
    if (kind === "markdown") markdown.push({ name: file.name, content: await file.text() });
    else if (kind === "xml") xml.push({ name: file.name, content: await file.text() });
    else if (kind === "image") images.push({ filename: file.name, blob: file });
    else ignored.push(file.name);
  }
  return { markdown, xml, images, ignored };
}

export function DropZone({ onDropped, disabled }: DropZoneProps) {
  const { t } = useTranslation("flexweg-import");
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (disabled) return;
      const items = e.dataTransfer.items;
      const files: File[] = [];
      // Prefer the entry API so folder drops are supported. Falling
      // back to .files gives flat lists only.
      if (items && items.length > 0 && typeof items[0].webkitGetAsEntry === "function") {
        for (let i = 0; i < items.length; i++) {
          const entry = items[i].webkitGetAsEntry();
          if (entry) files.push(...(await walkEntry(entry)));
        }
      } else if (e.dataTransfer.files) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          files.push(e.dataTransfer.files[i]);
        }
      }
      const bundle = await bundleFromFiles(files);
      onDropped(bundle);
    },
    [disabled, onDropped],
  );

  function handlePicker(e: React.ChangeEvent<HTMLInputElement>): void {
    const fileList = e.target.files;
    if (!fileList) return;
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) files.push(fileList[i]);
    void bundleFromFiles(files).then(onDropped);
    // Reset so picking the same files twice in a row triggers change.
    e.target.value = "";
  }

  return (
    <label
      className={
        "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-8 cursor-pointer transition-colors " +
        (dragOver
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
          : "border-surface-300 hover:border-surface-400 dark:border-surface-700 dark:hover:border-surface-600") +
        (disabled ? " opacity-50 pointer-events-none" : "")
      }
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
      }}
      onDrop={handleDrop}
    >
      <Upload className="h-6 w-6 text-surface-400" />
      <p className="text-sm font-medium">{t("drop.title")}</p>
      <p className="text-xs text-surface-500 dark:text-surface-400 text-center">
        {t("drop.help")}
      </p>
      <input
        type="file"
        multiple
        accept=".md,.xml,.jpg,.jpeg,.png,.webp,.svg,.gif"
        className="hidden"
        onChange={handlePicker}
      />
    </label>
  );
}
