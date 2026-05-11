import { useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("veltrix_admin") === "1");

  if (!authed) {
    return <AdminLogin onSuccess={() => { sessionStorage.setItem("veltrix_admin", "1"); setAuthed(true); }} />;
  }

  return <AdminDashboard onLogout={() => { sessionStorage.removeItem("veltrix_admin"); setAuthed(false); }} />;
}
