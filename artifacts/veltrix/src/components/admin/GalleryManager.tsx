import { useState, useRef } from "react";
import {
  useListGalleryPairs,
  useCreateGalleryPair,
  useUpdateGalleryPair,
  useDeleteGalleryPair,
  useRequestUploadUrl,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { GalleryPairResponse } from "@workspace/api-client-react";

const SERVICES = [
  "Exterior Wash",
  "Full Interior Detail",
  "Full Detail",
  "Engine Bay Cleaning",
  "Pet Hair Removal",
  "Custom Quote",
];

type UploadSlot = "before" | "after";

interface SlotState {
  file: File | null;
  path: string;
  preview: string;
}

interface UploadState {
  before: SlotState;
  after: SlotState;
}

const emptySlot: SlotState = { file: null, path: "", preview: "" };

const font = "'Poppins', sans-serif";

async function uploadToStorage(
  file: File,
  requestUrl: (params: { data: { name: string; size: number; contentType: string } }) => Promise<{ uploadURL: string; objectPath: string }>,
  onProgress?: (p: number) => void,
): Promise<string> {
  const { uploadURL, objectPath } = await requestUrl({
    data: { name: file.name, size: file.size, contentType: file.type },
  });
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadURL);
    xhr.setRequestHeader("Content-Type", file.type);
    if (onProgress) xhr.upload.onprogress = e => onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
    xhr.onerror = () => reject(new Error("Upload network error"));
    xhr.send(file);
  });
  return objectPath;
}

function EditModal({ pair, onClose }: { pair: GalleryPairResponse; onClose: () => void }) {
  const [service, setService] = useState(pair.service ?? "");
  const [caption, setCaption] = useState(pair.caption ?? "");
  const qc = useQueryClient();
  const { mutate, isPending } = useUpdateGalleryPair({
    mutation: { onSuccess: () => { qc.invalidateQueries(); onClose(); } }
  });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1px solid rgba(26,26,46,0.15)", fontSize: ".88rem",
    fontFamily: font, boxSizing: "border-box", background: "#f5f4f0"
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000, background: "rgba(26,26,46,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: font, fontWeight: 700, fontSize: "1rem", color: "#1a1a2e", margin: 0 }}>Edit Entry</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#999" }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: ".72rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Service</label>
            <select value={service} onChange={e => setService(e.target.value)} style={inputStyle}>
              <option value="">No service label</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: ".72rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Caption</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. 2022 Toyota Camry" style={inputStyle} />
          </div>
          <button
            disabled={isPending}
            onClick={() => mutate({ id: pair.id, data: { service: service || undefined, caption: caption || undefined } })}
            style={{
              background: "#1a1a2e", color: "#fff", border: "none",
              padding: "12px 0", borderRadius: 100, fontSize: ".88rem",
              fontWeight: 600, cursor: isPending ? "not-allowed" : "pointer",
              fontFamily: font, opacity: isPending ? 0.7 : 1
            }}
          >
            {isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GalleryManager() {
  const [service, setService] = useState(SERVICES[0]);
  const [caption, setCaption] = useState("");
  const [uploads, setUploads] = useState<UploadState>({ before: emptySlot, after: emptySlot });
  const [progress, setProgress] = useState<{ before: number; after: number }>({ before: 0, after: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingPair, setEditingPair] = useState<GalleryPairResponse | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const { data } = useListGalleryPairs({});
  const { mutate: createPair } = useCreateGalleryPair({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries();
        setSuccess("Gallery entry added!");
        setTimeout(() => setSuccess(""), 3000);
        setUploads({ before: emptySlot, after: emptySlot });
        setCaption("");
        setBusy(false);
      }
    }
  });
  const { mutate: deletePair } = useDeleteGalleryPair({ mutation: { onSuccess: () => qc.invalidateQueries() } });
  const { mutateAsync: requestUrl } = useRequestUploadUrl();

  const pairs = data?.pairs ?? [];

  const handleFileSelect = (slot: UploadSlot, file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 15 * 1024 * 1024) { setError("Image must be under 15 MB."); return; }
    setError("");
    const preview = URL.createObjectURL(file);
    setUploads(prev => ({ ...prev, [slot]: { file, path: "", preview } }));
  };

  const handleSubmit = async () => {
    const hasBefore = !!uploads.before.file;
    const hasAfter = !!uploads.after.file;
    if (!hasBefore && !hasAfter) {
      setError("Please select at least one image (Before or After).");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const [beforePath, afterPath] = await Promise.all([
        hasBefore ? uploadToStorage(uploads.before.file!, requestUrl, p => setProgress(prev => ({ ...prev, before: p }))) : Promise.resolve(undefined),
        hasAfter ? uploadToStorage(uploads.after.file!, requestUrl, p => setProgress(prev => ({ ...prev, after: p }))) : Promise.resolve(undefined),
      ]);
      createPair({
        data: {
          service,
          caption: caption || undefined,
          beforePath: beforePath || undefined,
          afterPath: afterPath || undefined,
        }
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
      setBusy(false);
    }
  };

  const label: React.CSSProperties = {
    fontSize: ".72rem", fontWeight: 700, color: "#999",
    textTransform: "uppercase", letterSpacing: ".06em",
    display: "block", marginBottom: 5
  };

  const inputBase: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1px solid rgba(26,26,46,0.12)", fontSize: ".88rem",
    fontFamily: font, background: "#f5f4f0"
  };

  const slotPicker = (slot: UploadSlot, ref: React.RefObject<HTMLInputElement | null>) => {
    const up = uploads[slot];
    const isBefore = slot === "before";
    return (
      <div style={{ flex: 1 }}>
        <label style={{ ...label, color: isBefore ? "#f59e0b" : "#16a34a" }}>
          {isBefore ? "⬅ Before" : "After ➡"}{" "}
          <span style={{ fontWeight: 400, color: "#ccc", fontSize: ".65rem" }}>(optional)</span>
        </label>
        <input
          ref={ref} type="file" accept="image/*" style={{ display: "none" }}
          id={`${slot}-input`}
          onChange={e => handleFileSelect(slot, e.target.files?.[0] ?? null)}
        />
        {up.preview ? (
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(26,26,46,0.1)" }}>
            <img src={up.preview} alt={slot} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
            <button
              onClick={() => { setUploads(prev => ({ ...prev, [slot]: emptySlot })); if (ref.current) ref.current.value = ""; }}
              style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "rgba(26,26,46,0.65)", border: "none", color: "#fff", cursor: "pointer", fontSize: ".75rem" }}
            >✕</button>
            {busy && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(26,26,46,0.1)" }}>
                <div style={{ width: `${progress[slot]}%`, height: "100%", background: "#2563eb", transition: "width .2s" }} />
              </div>
            )}
          </div>
        ) : (
          <label htmlFor={`${slot}-input`} style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "22px 12px", borderRadius: 12,
            border: "2px dashed rgba(26,26,46,0.12)",
            cursor: busy ? "not-allowed" : "pointer", background: "#f9f9f7",
            color: "#aaa", fontSize: ".82rem", textAlign: "center", minHeight: 100
          }}>
            <span style={{ fontSize: "1.6rem" }}>{isBefore ? "📷" : "✨"}</span>
            <span>Tap to add {slot} photo</span>
          </label>
        )}
      </div>
    );
  };

  const canSubmit = !busy && (!!uploads.before.file || !!uploads.after.file);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "clamp(280px, 34%, 360px) 1fr", gap: 24, alignItems: "start" }}>
      {/* Upload panel */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(26,26,46,0.08)", padding: 24 }}>
        <h3 style={{ fontFamily: font, fontWeight: 700, fontSize: ".95rem", color: "#1a1a2e", marginBottom: 20 }}>
          ➕ Add Gallery Entry
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={label}>Service</label>
            <select style={inputBase} value={service} onChange={e => setService(e.target.value)}>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Caption <span style={{ fontWeight: 400, color: "#ccc", fontSize: ".65rem" }}>(optional)</span></label>
            <input
              value={caption} onChange={e => setCaption(e.target.value)}
              placeholder="e.g. 2023 Honda Accord"
              style={inputBase}
            />
          </div>
          <div>
            <label style={label}>Photos — select one or both</label>
            <div style={{ display: "flex", gap: 10 }}>
              {slotPicker("before", beforeRef)}
              {slotPicker("after", afterRef)}
            </div>
          </div>
          {error && <p style={{ fontSize: ".82rem", color: "#ef4444", margin: 0 }}>{error}</p>}
          {success && <p style={{ fontSize: ".82rem", color: "#16a34a", margin: 0 }}>{success}</p>}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              background: "#1a1a2e", color: "#fff", border: "none",
              padding: "13px 0", borderRadius: 100, fontSize: ".88rem",
              fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed",
              fontFamily: font, opacity: canSubmit ? 1 : 0.4, transition: "opacity .2s"
            }}
          >
            {busy ? "Uploading…" : "Add to Gallery"}
          </button>
        </div>
      </div>

      {/* Gallery list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {pairs.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 18,
            border: "1px solid rgba(26,26,46,0.08)", padding: 48,
            textAlign: "center", color: "#bbb"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>🖼️</div>
            <p style={{ margin: 0, fontSize: ".9rem" }}>No gallery entries yet. Upload your first before/after photo!</p>
          </div>
        ) : pairs.map(pair => (
          <div key={pair.id} style={{ background: "#fff", borderRadius: 18, border: "1px solid rgba(26,26,46,0.08)", padding: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                {pair.service && (
                  <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.08)", padding: "3px 12px", borderRadius: 100, fontFamily: font }}>
                    {pair.service}
                  </span>
                )}
                {pair.caption && (
                  <span style={{ fontSize: ".78rem", color: "#888", marginLeft: 10, fontFamily: font }}>{pair.caption}</span>
                )}
                {!pair.service && !pair.caption && (
                  <span style={{ fontSize: ".78rem", color: "#ccc", fontFamily: font }}>No label</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEditingPair(pair)} style={{
                  background: "#f5f4f0", color: "#1a1a2e", border: "none",
                  padding: "6px 14px", borderRadius: 8, fontSize: ".75rem",
                  fontWeight: 600, cursor: "pointer", fontFamily: font
                }}>✏️ Edit</button>
                {deletingId === pair.id ? (
                  <>
                    <button onClick={() => { deletePair({ id: pair.id }); setDeletingId(null); }} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: ".75rem", fontWeight: 700, cursor: "pointer", fontFamily: font }}>Delete</button>
                    <button onClick={() => setDeletingId(null)} style={{ background: "#f5f4f0", color: "#888", border: "none", padding: "6px 10px", borderRadius: 8, fontSize: ".75rem", cursor: "pointer", fontFamily: font }}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setDeletingId(pair.id)} style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: ".75rem", fontWeight: 600, cursor: "pointer", fontFamily: font }}>🗑 Delete</button>
                )}
              </div>
            </div>

            {/* Images */}
            {pair.beforePath && pair.afterPath ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <ImagePreview path={pair.beforePath} label="Before" color="#f59e0b" />
                <ImagePreview path={pair.afterPath} label="After" color="#16a34a" />
              </div>
            ) : pair.beforePath ? (
              <ImagePreview path={pair.beforePath} label="Before (only)" color="#f59e0b" full />
            ) : pair.afterPath ? (
              <ImagePreview path={pair.afterPath} label="After (only)" color="#16a34a" full />
            ) : null}
          </div>
        ))}
      </div>

      {editingPair && <EditModal pair={editingPair} onClose={() => setEditingPair(null)} />}
    </div>
  );
}

function ImagePreview({ path, label, color, full }: { path: string; label: string; color: string; full?: boolean }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <div style={{ fontSize: ".68rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4, fontFamily: "'Poppins', sans-serif" }}>{label}</div>
      <img
        src={`/api/storage${path}`}
        alt={label}
        style={{ width: "100%", aspectRatio: full ? "16/9" : "4/3", objectFit: "cover", borderRadius: 10, display: "block", border: "1px solid rgba(26,26,46,0.08)" }}
      />
    </div>
  );
}
