import { useState, useRef } from "react";
import { useListGalleryPhotos, useCreateGalleryPhoto, useDeleteGalleryPhoto } from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";

const SERVICES = [
  "Exterior Wash",
  "Full Interior Detail",
  "Full Detail",
  "Engine Bay Cleaning",
  "Pet Hair Removal",
  "Custom Quote",
];

const PHOTO_TYPES = [
  { value: "hero", label: "Hero (banner)" },
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
];

export default function GalleryManager() {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [photoType, setPhotoType] = useState<"hero" | "before" | "after">("after");
  const [caption, setCaption] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, refetch } = useListGalleryPhotos({});
  const { mutate: createPhoto, isPending: saving } = useCreateGalleryPhoto({
    mutation: { onSuccess: () => { refetch(); setUploadSuccess("Photo added!"); setTimeout(() => setUploadSuccess(""), 3000); } }
  });
  const { mutate: deletePhoto } = useDeleteGalleryPhoto({
    mutation: { onSuccess: () => refetch() }
  });

  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: (response: { objectPath: string }) => {
      createPhoto({
        data: {
          service: selectedService,
          photoType,
          objectPath: response.objectPath,
          caption: caption || undefined,
          sortOrder: 0,
        }
      });
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
    },
    onError: (err: Error) => setUploadError(err.message),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploadSuccess("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Image must be under 15 MB.");
      return;
    }
    await uploadFile(file);
  };

  const photos = data?.photos ?? [];
  const grouped = SERVICES.reduce<Record<string, typeof photos>>((acc, svc) => {
    acc[svc] = photos.filter((p) => p.service === svc);
    return acc;
  }, {});

  const label: React.CSSProperties = {
    fontSize: ".78rem", fontWeight: 700, color: "#475569",
    textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6, display: "block"
  };
  const select: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: ".88rem", color: "#0f172a",
    fontFamily: "'DM Sans', sans-serif", background: "#fff", cursor: "pointer"
  };
  const input: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: ".88rem", color: "#0f172a",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box"
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24, alignItems: "start" }}>
      {/* Upload panel */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: 24 }}>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: 20 }}>
          📤 Upload New Photo
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={label}>Service</label>
            <select style={select} value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={label}>Photo Type</label>
            <div style={{ display: "flex", gap: 8 }}>
              {PHOTO_TYPES.map((t) => (
                <button key={t.value} onClick={() => setPhotoType(t.value as typeof photoType)} style={{
                  flex: 1, padding: "9px 0", borderRadius: 10, fontSize: ".78rem", fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .15s",
                  border: photoType === t.value ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                  background: photoType === t.value ? "#eff6ff" : "#fff",
                  color: photoType === t.value ? "#2563eb" : "#64748b"
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={label}>Caption (optional)</label>
            <input style={input} placeholder="e.g. 2023 Toyota Camry" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>

          <div>
            <label style={label}>Photo</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading || saving} style={{ display: "none" }} id="gallery-file-input" />
            <label htmlFor="gallery-file-input" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "14px 0", borderRadius: 12, border: "2px dashed #cbd5e1",
              cursor: isUploading || saving ? "not-allowed" : "pointer",
              background: "#f8fafc", color: "#64748b", fontSize: ".88rem", fontWeight: 500,
              transition: "border-color .2s"
            }}>
              {isUploading ? (
                <span>Uploading… {progress}%</span>
              ) : saving ? (
                <span>Saving…</span>
              ) : (
                <>📷 Tap to choose a photo</>
              )}
            </label>
          </div>

          {uploadError && <p style={{ fontSize: ".82rem", color: "#ef4444", margin: 0 }}>{uploadError}</p>}
          {uploadSuccess && <p style={{ fontSize: ".82rem", color: "#22c55e", margin: 0 }}>{uploadSuccess}</p>}
        </div>
      </div>

      {/* Photo grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {SERVICES.map((svc) => {
          const svcPhotos = grouped[svc];
          if (svcPhotos.length === 0) return null;
          return (
            <div key={svc} style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: 20 }}>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: ".9rem", fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>
                {svc} <span style={{ fontSize: ".75rem", color: "#94a3b8", fontWeight: 400 }}>({svcPhotos.length} photo{svcPhotos.length !== 1 ? "s" : ""})</span>
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                {svcPhotos.map((p) => (
                  <div key={p.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                    <img
                      src={`/api/storage${p.objectPath}`}
                      alt={p.caption || `${svc} ${p.photoType}`}
                      style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ padding: "6px 8px", background: "#f8fafc" }}>
                      <span style={{
                        fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em",
                        padding: "2px 8px", borderRadius: 50,
                        background: p.photoType === "after" ? "#2563eb" : "#e2e8f0",
                        color: p.photoType === "after" ? "#fff" : "#64748b"
                      }}>{p.photoType}</span>
                      {p.caption && <p style={{ fontSize: ".72rem", color: "#64748b", margin: "4px 0 0", lineHeight: 1.3 }}>{p.caption}</p>}
                    </div>
                    <button onClick={() => deletePhoto({ id: p.id })} style={{
                      position: "absolute", top: 6, right: 6,
                      width: 24, height: 24, borderRadius: "50%",
                      background: "rgba(0,0,0,0.55)", border: "none",
                      color: "#fff", fontSize: ".75rem", cursor: "pointer", lineHeight: 1,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }} title="Delete photo">✕</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {photos.length === 0 && (
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0", padding: 40, textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>🖼️</div>
            <p style={{ margin: 0, fontSize: ".9rem" }}>No photos uploaded yet. Upload your first photo!</p>
          </div>
        )}
      </div>
    </div>
  );
}
