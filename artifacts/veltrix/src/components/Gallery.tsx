import { useEffect, useRef } from "react";
import { useListGalleryPhotos } from "@workspace/api-client-react";
import exteriorHero from "@assets/IMG_1794_1778547880956.jpeg";
import exteriorBefore from "@assets/IMG_1795_1778547880956.jpeg";
import exteriorAfter from "@assets/IMG_1793_1778547880956.jpeg";

type StaticCard = {
  title: string;
  desc: string;
  heroImg?: string;
  beforeImg?: string;
  afterImg?: string;
  beforeEmoji?: string;
  afterEmoji?: string;
};

const STATIC_CARDS: StaticCard[] = [
  {
    title: "Full Exterior Wash",
    desc: "Hand wash, clay bar, wax, tire shine & trim dressing",
    heroImg: exteriorHero,
    beforeImg: exteriorBefore,
    afterImg: exteriorAfter,
  },
  {
    beforeEmoji: "🟤", afterEmoji: "✨",
    title: "Interior Deep Clean",
    desc: "Shampooed seats, steam-cleaned carpet, full dashboard detail"
  },
  {
    beforeEmoji: "🐾", afterEmoji: "🌟",
    title: "Pet Hair Removal",
    desc: "Complete removal from all fabric surfaces including carpet and rear seats"
  },
];

function BeforeAfterPanel({ img, emoji, label, isAfter }: { img?: string; emoji?: string; label: string; isAfter?: boolean }) {
  return img ? (
    <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
      <img src={img} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <span style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
        padding: "3px 12px", borderRadius: 50,
        background: isAfter ? "#2563eb" : "#e2e8f0", color: isAfter ? "#fff" : "#64748b"
      }}>{label}</span>
    </div>
  ) : (
    <div style={{
      aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "3.5rem", position: "relative",
      background: isAfter ? "linear-gradient(135deg, #dbeafe, #eff6ff)" : "linear-gradient(135deg, #f1f5f9, #e2e8f0)"
    }}>
      {emoji}
      <span style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
        padding: "3px 12px", borderRadius: 50,
        background: isAfter ? "#2563eb" : "#e2e8f0", color: isAfter ? "#fff" : "#64748b"
      }}>{label}</span>
    </div>
  );
}

export default function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const { data } = useListGalleryPhotos({});
  const dynamicPhotos = data?.photos ?? [];

  // Build dynamic cards from uploaded photos (group by service, pick first hero/before/after)
  const dynamicCards: StaticCard[] = Object.entries(
    dynamicPhotos.reduce<Record<string, typeof dynamicPhotos>>((acc, p) => {
      if (!acc[p.service]) acc[p.service] = [];
      acc[p.service].push(p);
      return acc;
    }, {})
  )
    .filter(([title]) => !STATIC_CARDS.some((s) => s.title === title))
    .map(([title, photos]) => {
      const hero = photos.find((p) => p.photoType === "hero");
      const before = photos.find((p) => p.photoType === "before");
      const after = photos.find((p) => p.photoType === "after");
      const desc = photos[0]?.caption || title;
      return {
        title,
        desc,
        heroImg: hero ? `/api/storage${hero.objectPath}` : undefined,
        beforeImg: before ? `/api/storage${before.objectPath}` : undefined,
        afterImg: after ? `/api/storage${after.objectPath}` : undefined,
      };
    });

  // Also merge uploaded photos into matching static cards
  const mergedStaticCards: StaticCard[] = STATIC_CARDS.map((card) => {
    const uploaded = dynamicPhotos.filter((p) => p.service === card.title);
    if (uploaded.length === 0) return card;
    const hero = uploaded.find((p) => p.photoType === "hero");
    const before = uploaded.find((p) => p.photoType === "before");
    const after = uploaded.find((p) => p.photoType === "after");
    return {
      ...card,
      heroImg: hero ? `/api/storage${hero.objectPath}` : card.heroImg,
      beforeImg: before ? `/api/storage${before.objectPath}` : card.beforeImg,
      afterImg: after ? `/api/storage${after.objectPath}` : card.afterImg,
    };
  });

  const allCards = [...mergedStaticCards, ...dynamicCards];

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
  }, []);

  return (
    <section id="gallery" ref={ref} style={{ background: "#f5f8ff", padding: "96px 5%" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{
          display: "inline-block", fontSize: ".75rem", fontWeight: 700,
          letterSpacing: ".1em", textTransform: "uppercase",
          color: "#2563eb", background: "#dbeafe",
          padding: "6px 16px", borderRadius: 50, marginBottom: 14
        }}>Real Results</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
          fontWeight: 800, letterSpacing: "-1.2px",
          color: "#0f172a", marginBottom: 14
        }}>Before &amp; After</h2>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.72, fontWeight: 300, maxWidth: 520, margin: "0 auto" }}>
          See the Veltrix difference — every job is done with the same care and attention to detail.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24, maxWidth: 1100, margin: "0 auto"
      }}>
        {allCards.map((c) => (
          <div key={c.title} className="reveal ba-card-hover" style={{
            background: "#ffffff", borderRadius: 20,
            overflow: "hidden", border: "1px solid #e2e8f0",
            transition: "transform .3s, box-shadow .3s"
          }}>
            {/* Hero photo */}
            {c.heroImg && (
              <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden" }}>
                <img
                  src={c.heroImg}
                  alt={`${c.title} in action`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)"
                }} />
                <span style={{
                  position: "absolute", bottom: 12, left: 16,
                  fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
                  padding: "4px 12px", borderRadius: 50,
                  background: "#2563eb", color: "#fff"
                }}>In Action</span>
              </div>
            )}

            {/* Before / After panels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <BeforeAfterPanel img={c.beforeImg} emoji={c.beforeEmoji} label="Before" />
              <BeforeAfterPanel img={c.afterImg} emoji={c.afterEmoji} label="After" isAfter />
            </div>

            <div style={{ padding: "20px 22px" }}>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: ".95rem", fontWeight: 700, color: "#0f172a", marginBottom: 5 }}>{c.title}</h4>
              <p style={{ fontSize: ".82rem", color: "#64748b", fontWeight: 300 }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center", marginTop: 32, fontSize: ".85rem", color: "#64748b" }}>
        📸 Check out more results on our{" "}
        <a href="https://www.instagram.com/veltrix.mobile.detail" target="_blank" rel="noreferrer"
          style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
          Instagram @veltrix.mobile.detail
        </a>
      </p>

      <style>{`
        .ba-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 40px rgba(37,99,235,0.12);
        }
      `}</style>
    </section>
  );
}
