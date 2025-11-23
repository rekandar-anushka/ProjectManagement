import React, { useState } from "react";
import { Outlet, Link, useNavigate, Navigate, useLocation } from "react-router-dom";

function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role"); // 👈 check user role

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ Redirect /dashboard to /dashboard/my-tasks
  if (location.pathname === "/dashboard") {
    return <Navigate to="my-tasks" replace />;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f1f3f6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarCollapsed ? "60px" : "220px",
          backgroundColor: "#fff",
          padding: "20px",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          transition: "width 0.3s",
        }}
      >
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{ marginBottom: "20px", cursor: "pointer", fontWeight: "bold" }}
        >
          {sidebarCollapsed ? "▶" : "◀"}
        </button>

        {!sidebarCollapsed && (
          <>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>Menu</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <li>
                <Link
                  to="my-tasks"
                  style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}
                >
                  📌 My Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="monthly-goals"
                  style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}
                >
                  📅 Monthly Goals
                </Link>
              </li>

              {/* ✅ Only show Analytics for managers */}
              {role === "MANAGER" && (
                <li>
                  <Link
                    to="analytics"
                    style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}
                  >
                    📊 Analytics
                  </Link>
                </li>
              )}
            </ul>
          </>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <button
            onClick={logout}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#dc3545",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* Render the subpage content */}
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
