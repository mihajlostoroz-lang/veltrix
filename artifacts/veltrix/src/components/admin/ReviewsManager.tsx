import { useState } from "react";
import { useListAdminReviews, useUpdateReviewStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

type StatusFilter = "pending" | "approved" | "rejected" | "all";

const STARS = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "#fef3c7", color: "#92400e" },
  approved: { bg: "#dcfce7", color: "#166534" },
  rejected: { bg: "#fee2e2", color: "#991b1b" },
};

export default function ReviewsManager() {
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const qc = useQueryClient();

  const params = filter === "all" ? {} : { status: filter };
  const { data, isLoading } = useListAdminReviews(params);
  const { data: allData } = useListAdminReviews({});

  const { mutate: updateStatus } = useUpdateReviewStatus({
    mutation: { onSuccess: () => qc.invalidateQueries() },
  });

  const reviews = data?.reviews ?? [];
  const allReviews = allData?.reviews ?? [];
  const pendingCount = allReviews.filter((r) => r.status === "pending").length;

  const filterBtn = (v: StatusFilter, label: string, count?: number) => (
    <button onClick={() => setFilter(v)} style={{
      padding: "9px 20px", borderRadius: 50, fontSize: ".84rem", fontWeight: 600,
      cursor: "pointer", border: "none", fontFamily: "'DM Sans', sans-serif",
      background: filter === v ? "#2563eb" : "transparent",
      color: filter === v ? "#fff" : "#64748b",
      transition: "all .2s", display: "flex", alignItems: "center", gap: 6,
    }}>
      {label}
      {count !== undefined && count > 0 && (
        <span style={{
          background: filter === v ? "rgba(255,255,255,0.3)" : "#ef4444",
          color: "#fff", borderRadius: 50, fontSize: ".7rem", fontWeight: 700,
          padding: "1px 7px", lineHeight: 1.5,
        }}>{count}</span>
      )}
    </button>
  );

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        background: "#fff", borderRadius: 50, padding: 4,
        border: "1px solid #e2e8f0", display: "inline-flex", marginBottom: 24, gap: 2
      }}>
        {filterBtn("pending", "Pending", pendingCount)}
        {filterBtn("approved", "Approved")}
        {filterBtn("rejected", "Rejected")}
        {filterBtn("all", "All")}
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: 48, color: "#64748b" }}>Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0",
          padding: 48, textAlign: "center", color: "#94a3b8"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: 10 }}>⭐</div>
          <p style={{ margin: 0, fontSize: ".95rem" }}>
            {filter === "pending" ? "No reviews awaiting approval." : `No ${filter} reviews yet.`}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {reviews.map((r) => (
            <div key={r.id} style={{
              background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
              padding: "20px 22px", display: "grid",
              gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start"
            }}>
              <div>
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: "#0f172a", fontSize: ".95rem" }}>{r.name}</span>
                  {r.location && <span style={{ fontSize: ".78rem", color: "#94a3b8" }}>· {r.location}</span>}
                  {r.vehicle && <span style={{ fontSize: ".78rem", color: "#94a3b8" }}>· {r.vehicle}</span>}
                  <span style={{ color: "#f59e0b", fontSize: ".9rem", letterSpacing: 2 }}>{STARS(r.rating)}</span>
                  <span style={{
                    fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em",
                    padding: "2px 10px", borderRadius: 50,
                    background: STATUS_COLORS[r.status]?.bg ?? "#f1f5f9",
                    color: STATUS_COLORS[r.status]?.color ?? "#475569",
                  }}>{r.status}</span>
                </div>

                {/* Review text */}
                <p style={{ fontSize: ".9rem", color: "#1e293b", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
                  "{r.text}"
                </p>

                {/* Date */}
                <p style={{ fontSize: ".75rem", color: "#94a3b8", margin: "8px 0 0" }}>
                  Submitted {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 120 }}>
                {r.status !== "approved" && (
                  <button onClick={() => updateStatus({ id: r.id, data: { status: "approved" } })} style={{
                    background: "#22c55e", color: "#fff", border: "none",
                    padding: "8px 16px", borderRadius: 10, fontSize: ".82rem",
                    fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "opacity .15s", textAlign: "center"
                  }}>✓ Approve</button>
                )}
                {r.status !== "rejected" && (
                  <button onClick={() => updateStatus({ id: r.id, data: { status: "rejected" } })} style={{
                    background: "#ef4444", color: "#fff", border: "none",
                    padding: "8px 16px", borderRadius: 10, fontSize: ".82rem",
                    fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "opacity .15s", textAlign: "center"
                  }}>✕ Reject</button>
                )}
                {r.status !== "pending" && (
                  <button onClick={() => updateStatus({ id: r.id, data: { status: "pending" } })} style={{
                    background: "transparent", color: "#64748b",
                    border: "1.5px solid #e2e8f0",
                    padding: "8px 16px", borderRadius: 10, fontSize: ".78rem",
                    fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    textAlign: "center"
                  }}>↩ Reset</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
