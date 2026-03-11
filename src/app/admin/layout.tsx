import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
        <AdminSidebar />
        <main
          className="ml-60 min-h-screen"
          style={{ padding: "40px 48px" }}
        >
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}