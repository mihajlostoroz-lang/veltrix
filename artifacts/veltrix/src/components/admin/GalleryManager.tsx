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

interface UploadState {
  before: { file: File | null; path: string; preview: string };
  after: { file: File | null; path: string; preview: string };
}

const emptySlot = { file: null, path: "", preview: "" };

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
  const { mutate, isPending } = useUpdateGalleryPair({ mutation: { onSuccess: () => { qc.invalidateQueries(); onClose(); } } });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", margin: 0 }}>Edit Entry</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#94a3b8" }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: ".75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Service</label>
            <select value={service} onChange={e => setService(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: ".88rem", fontFamily: "'DM Sans', sans-serif" }}>
              <option value="">No service label</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: ".75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 }}>Caption</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. 2022 Toyota Camry"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: ".88rem", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
          </div>
          <button disabled={isPending} onClick={() => mutate({ id: pair.id, data: { service: service || undefined, caption: caption || undefined } })}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: "12px 0", borderRadius: 50, fontSize: ".9rem", fontWeight: 700, cursor: isPending ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: isPending ? 0.7 : 1 }}>
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
  const { mutate: createPair } = useCreateGalleryPair({ mutation: { onSuccess: () => { qc.invalidateQueries(); setSuccess("Gallery entry added!"); setTimeout(() => setSuccess(""), 3000); setUploads({ before: emptySlot, after: emptySlot }); setCaption(""); setBusy(false); } } });
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
    if (!uploads.before.file || !uploads.after.file) { setError("Please select both a Before and After image."); return; }
    setError("");
    setBusy(true);
    try {
      const [beforePath, afterPath] = await Promise.all([
        uploadToStorage(uploads.before.file, requestUrl, p => setProgress(prev => ({ ...prev, before: p }))),
        uploadToStorage(uploads.after.file, requestUrl, p => setProgress(prev => ({ ...prev, after: p }))),
      ]);
      createPair({ data: { service, caption: caption || undefined, beforePath, afterPath } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
      setBusy(false);
    }
  };

  const label: React.CSSProperties = { fontSize: ".75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 5 };
  const select: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: ".88rem", fontFamily: "'DM Sans', sans-serif", background: "#fff" };

  const slotPicker = (slot: UploadSlot, ref: React.RefObject<HTMLInputElement | null>) => {
    const up = uploads[slot];
    return (
      <div style={{ flex: 1 }}>
        <label style={{ ...label, color: slot === "before" ? "#f59e0b" : "#16a34a" }}>
          {slot === "before" ? "⬅ Before" : "After ➡"}
        </label>
        <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} id={`${slot}-input`}
          onChange={e => handleFileSelect(slot, e.target.files?.[0] ?? null)} />
        {up.preview ? (
          <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "2px solid #e2e8f0" }}>
            <img src={up.preview} alt={slot} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
            <button onClick={() => { setUploads(prev => ({ ...prev, [slot]: emptySlot })); if (ref.current) ref.current.value = ""; }}
              style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", cursor: "pointer", fontSize: ".75rem" }}>✕</button>
            {busy && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "#e2e8f0" }}>
                <div style={{ width: `${progress[slot]}%`, height: "100%", background: "#2563eb", transition: "width .2s" }} />
              </div>
            )}
          </div>
        ) : (
          <label htmlFor={`${slot}-input`} style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "24px 12px", borderRadius: 12, border: "2px dashed #cbd5e1",
            cursor: busy ? "not-allowed" : "pointer", background: "#f8fafc",
            color: "#64748b", fontSize: ".82rem", textAlign: "center", minHeight: 110
          }}>
            <span style={{ fontSize: "1.6rem" }}>{slot === "before" ? "📷" : "✨"}</span>
            <span>Tap to add {slot} photo</span>
          </label>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "clamp(300px, 34%, 380px) 1fr", gap: 24, alignItems: "start" }}>
      {/* Upload panel */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: 24 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: 20 }}>
          ➕ Add Before / After Entry
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={label}>Service</label>
            <select style={select} value={service} onChange={e => setService(e.target.value)}>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Caption (optional)</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. 2023 Honda Accord"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: ".88rem", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={label}>Photos</label>
            <div style={{ display: "flex", gap: 10 }}>
              {slotPicker("before", beforeRef)}
              {slotPicker("after", afterRef)}
            </div>
          </div>
          {error && <p style={{ fontSize: ".82rem", color: "#ef4444", margin: 0 }}>{error}</p>}
          {success && <p style={{ fontSize: ".82rem", color: "#16a34a", margin: 0 }}>{success}</p>}
          <button onClick={handleSubmit} disabled={busy || !uploads.before.preview || !uploads.after.preview}
            style={{
              background: "#2563eb", color: "#fff", border: "none",
              padding: "13px 0", borderRadius: 50, fontSize: ".9rem",
              fontWeight: 700, cursor: (busy || !uploads.before.preview || !uploads.after.preview) ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              opacity: (busy || !uploads.before.preview || !uploads.after.preview) ? 0.55 : 1,
              transition: "opacity .2s"
            }}>
            {busy ? "Uploading…" : "Add to Gallery"}
          </button>
        </div>
      </div>

      {/* Gallery pairs grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {pairs.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: 48, textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>🖼️</div>
            <p style={{ margin: 0, fontSize: ".9rem" }}>No gallery entries yet. Upload your first before/after pair!</p>
          </div>
        ) : pairs.map(pair => (
          <div key={pair.id} style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: 16 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                {pair.service && <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#2563eb", background: "#eff6ff", padding: "3px 12px", borderRadius: 50 }}>{pair.service}</span>}
                {pair.caption && <span style={{ fontSize: ".78rem", color: "#64748b", marginLeft: 10 }}>{pair.caption}</span>}
                {!pair.service && !pair.caption && <span style={{ fontSize: ".78rem", color: "#94a3b8" }}>No label</span>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEditingPair(pair)} style={{
                  background: "#eff6ff", color: "#2563eb", border: "none",
                  padding: "6px 14px", borderRadius: 8, fontSize: ".75rem",
                  fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}>✏️ Edit</button>
                {deletingId === pair.id ? (
                  <>
                    <button onClick={() => { deletePair({ id: pair.id }); setDeletingId(null); }} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 8, fontSize: ".75rem", fontWeight: 700, cursor: "pointer" }}>Confirm</button>
                    <button onClick={() => setDeletingId(null)} style={{ background: "#f5f8ff", color: "#64748b", border: "1px solid #e2e8f0", padding: "6px 10px", borderRadius: 8, fontSize: ".75rem", cursor: "pointer" }}>No</button>
                  </>
                ) : (
                  <button onClick={() => setDeletingId(pair.id)} style={{ background: "#fef2f2", color: "#ef4444", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: ".75rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🗑 Delete</button>
                )}
              </div>
            </div>
            {/* Before/After images */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: ".68rem", fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Before</div>
                <img src={`/api/storage${pair.beforePath}`} alt="Before"
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10, display: "block", border: "1px solid #e2e8f0" }} />
              </div>
              <div>
                <div style={{ fontSize: ".68rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>After</div>
                <img src={`/api/storage${pair.afterPath}`} alt="After"
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10, display: "block", border: "1px solid #e2e8f0" }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPair && <EditModal pair={editingPair} onClose={() => setEditingPair(null)} />}
    </div>
  );
}
