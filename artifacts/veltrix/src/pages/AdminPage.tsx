import { useEffect, useState } from "react";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useGetAdminMe();

  const { mutate: logout } = useAdminLogout({
    mutation: {
      onSuccess: () => {
        qc.clear();
        setAuthed(false);
      }
    }
  });

  useEffect(() => {
    if (!isLoading) {
      setAuthed(data?.authenticated === true);
      setChecked(true);
    }
  }, [isLoading, data]);

  if (!checked || isLoading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(150deg, #ffffff 0%, #eff6ff 55%, #dbeafe 100%)"
      }}>
        <div style={{ textAlign: "center", color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔐</div>
          <p>Checking session…</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => { qc.invalidateQueries(); setAuthed(true); }} />;
  }

  return <AdminDashboard onLogout={() => logout()} />;
}
