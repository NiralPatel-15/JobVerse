import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-[#f1f5f9]">
      {/* ================= MOBILE SIDEBAR ================= */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden">
            <AdminSidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </aside>
        </>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex lg:w-64 flex-shrink-0">
        <AdminSidebar sidebarOpen={true} setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="flex-shrink-0 border-b border-slate-800 bg-[#0f172a] z-20">
          <AdminNavbar setSidebarOpen={setSidebarOpen} />
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto bg-[#f1f5f9]">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
