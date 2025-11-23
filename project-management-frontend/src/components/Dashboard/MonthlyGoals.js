import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
function MonthlyGoals() {
  const [tasks, setTasks] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const fetchTasks = useCallback(async () => {
    try {
      const res =
        role === "MANAGER"
          ? await axios.get(`${BASE_URL}/api/tasks`)
          : await axios.get(`${BASE_URL}/api/tasks/user/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [role, userId]);

  const fetchUsersMap = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users`);
      const map = {};
      res.data.forEach((u) => (map[u.id] = u.username));
      setUsersMap(map);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchUsersMap();
  }, [fetchTasks, fetchUsersMap]);

  // Group tasks by month
  const monthlyTasks = tasks.reduce((acc, task) => {
    const month = task.dueDate ? task.dueDate.slice(0, 7) : "No Due Date";
    if (!acc[month]) acc[month] = [];
    acc[month].push(task);
    return acc;
  }, {});

  // Helper to get color for status
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return { color: "#2e7d32", fontWeight: "bold" }; // Green
      case "ongoing":
        return { color: "#0277bd", fontWeight: "bold" }; // Blue
      case "pending":
        return { color: "#f57c00", fontWeight: "bold" }; // Orange
      default:
        return { color: "#757575", fontWeight: "bold" }; // Gray
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h3 style={{ marginBottom: "10px" }}>Monthly Goals</h3>

      {Object.keys(monthlyTasks).length === 0 && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          No tasks assigned yet
        </div>
      )}

      {Object.keys(monthlyTasks).map((month) => (
        <div
          key={month}
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h4 style={{ marginBottom: "10px" }}>{month}</h4>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {monthlyTasks[month].map((t) => (
              <li
                key={t.id}
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#f1f3f6",
                }}
              >
                <strong>{t.title}</strong> - {t.description} <br />
                <small>
                  Assigned: {usersMap[t.assignedTo] || "Unassigned"} | Due:{" "}
                  {t.dueDate || "N/A"}
                </small>
                <br />
                <span style={getStatusStyle(t.status)}>
                  Status: {t.status ? t.status : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default MonthlyGoals;
