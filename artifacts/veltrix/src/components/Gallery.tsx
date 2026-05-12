import { useEffect, useRef } from "react";
import { useListGalleryPairs } from "@workspace/api-client-react";
import type { GalleryPairResponse } from "@workspace/api-client-react";

const STATIC_CARDS = [
  { beforeEmoji: "🚗", afterEmoji: "✨", title: "Full Exterior Wash", desc: "Hand wash, clay bar, wax, tire shine & trim dressing" },
  { beforeEmoji: "🟤", afterEmoji: "✨", title: "Interior Deep Clean", desc: "Shampooed seats, steam-cleaned carpet, full dashboard detail" },
  { beforeEmoji: "🐾", afterEmoji: "🌟", title: "Pet Hair Removal", desc: "Complete removal from all fabric surfaces" },
];

function imgUrl(path: string) {
  return `/api/storage${path}`;
}

function PairCard({ pair }: { pair: GalleryPairResponse }) {
  const hasBefore = !!pair.beforePath;
  const hasAfter = !!pair.afterPath;
  const hasBoth = hasBefore && hasAfter;
  const hasOne = hasBefore !== hasAfter;

  return (
    <div className="reveal ba-card-hover" style={{
      background: "#f5f4f0", borderRadius: 20,
      overflow: "hidden", border: "1px solid rgba(26,26,46,0.08)",
      transition: "transform .3s, box-shadow .3s"
    }}>
      {hasBoth ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <ImagePanel path={pair.beforePath!} label="Before" />
          <ImagePanel path={pair.afterPath!} label="After" isAfter />
        </div>
      ) : hasOne ? (
        <SingleImagePanel
          path={(pair.beforePath ?? pair.afterPath)!}
          label={pair.beforePath ? "Before" : "After"}
          isAfter={!pair.beforePath}
        />
      ) : null}
      {(pair.service || pair.caption) && (
        <div style={{ padding: "18px 20px" }}>
          {pair.service && (
            <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: ".92rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{pair.service}</h4>
          )}
          {pair.caption && (
            <p style={{ fontSize: ".8rem", color: "#888" }}>{pair.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}

function ImagePanel({ path, label, isAfter }: { path: string; label: string; isAfter?: boolean }) {
  return (
    <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
      <img
        src={imgUrl(path)}
        alt={label}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <span style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
        padding: "3px 12px", borderRadius: 100,
        background: isAfter ? "#2563eb" : "rgba(26,26,46,0.55)", color: "#fff"
      }}>{label}</span>
    </div>
  );
}

function SingleImagePanel({ path, label, isAfter }: { path: string; label: string; isAfter?: boolean }) {
  return (
    <div style={{ width: "100%", aspectRatio: "16/9", position: "relative", overflow: "hidden" }}>
      <img
        src={imgUrl(path)}
        alt={label}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <span style={{
        position: "absolute", bottom: 12, left: 16,
        fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
        padding: "4px 14px", borderRadius: 100,
        background: isAfter ? "#2563eb" : "rgba(26,26,46,0.55)", color: "#fff"
      }}>{label}</span>
    </div>
  );
}

function StaticCard({ card }: { card: typeof STATIC_CARDS[number] }) {
  return (
    <div className="reveal ba-card-hover" style={{
      background: "#f5f4f0", borderRadius: 20,
      overflow: "hidden", border: "1px solid rgba(26,26,46,0.08)",
      transition: "transform .3s, box-shadow .3s"
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {[
          { emoji: card.beforeEmoji, label: "Before", isAfter: false },
          { emoji: card.afterEmoji, label: "After", isAfter: true },
        ].map(({ emoji, label, isAfter }) => (
          <div key={label} style={{
            aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "3rem", position: "relative",
            background: isAfter ? "linear-gradient(135deg, #dbeafe, #eff6ff)" : "#e9e8e4"
          }}>
            {emoji}
            <span style={{
              position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
              fontSize: ".65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
              padding: "3px 12px", borderRadius: 100,
              background: isAfter ? "#2563eb" : "rgba(26,26,46,0.15)", color: isAfter ? "#fff" : "#1a1a2e"
            }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "18px 20px" }}>
        <h4 style={{ fontFamily: "'Poppins', sans-serif", fontSize: ".92rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{card.title}</h4>
        <p style={{ fontSize: ".8rem", color: "#888" }}>{card.desc}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const { data } = useListGalleryPairs({});
  const pairs = data?.pairs ?? [];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveals = el.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    reveals.forEach((r) => observer.observe(r));
    return () => observer.disconnect();
  }, [pairs]);

  return (
    <section id="gallery" ref={ref} style={{ background: "#fff", padding: "96px 5%" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{
          fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em",
          textTransform: "uppercase", color: "#2563eb", marginBottom: 12
        }}>Real Results</div>
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800, letterSpacing: "-2px", color: "#1a1a2e", marginBottom: 14
        }}>Before &amp; After</h2>
        <p style={{ fontSize: ".95rem", color: "#888", lineHeight: 1.72, maxWidth: 480, margin: "0 auto" }}>
          See the Veltrix difference — every job is done with the same care and attention to detail.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24, maxWidth: 1100, margin: "0 auto"
      }}>
        {pairs.length > 0
          ? pairs.map((pair) => <PairCard key={pair.id} pair={pair} />)
          : STATIC_CARDS.map((card) => <StaticCard key={card.title} card={card} />)
        }
      </div>

      <p style={{ textAlign: "center", marginTop: 36, fontSize: ".85rem", color: "#999" }}>
        See more results on our{" "}
        <a href="https://www.instagram.com/veltrix.mobile.detail" target="_blank" rel="noreferrer"
          style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
          Instagram @veltrix.mobile.detail
        </a>
      </p>

      <style>{`
        .ba-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 48px rgba(26,26,46,0.1) !important;
        }
      `}</style>
    </section>
  );
}
