import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const role = localStorage.getItem("role");

  // Fetch all tasks (for pie chart)
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Fetch employee summary (for bar chart)
  const fetchEmployeeSummary = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tasks/employee-summary");
      const data = Object.keys(res.data).map((key) => ({
        name: key,
        tasks: res.data[key],
      }));
      setEmployeeSummary(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (role === "MANAGER") {
      fetchTasks();
      fetchEmployeeSummary();
    }
  }, [fetchTasks, fetchEmployeeSummary, role]);

  // Restrict access to managers only
  if (role !== "MANAGER") {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#444" }}>Access Denied</h3>
        <p>Analytics are available only for managers.</p>
      </div>
    );
  }

  // Count tasks by status
  const summaryCounts = {
    PENDING: tasks.filter((t) => t.status === "PENDING").length,
    ONGOING: tasks.filter((t) => t.status === "ONGOING").length,
    COMPLETED: tasks.filter((t) => t.status === "COMPLETED").length,
  };

  const COLORS = ["#f87171", "#fbbf24", "#34d399"];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
      {/* Pie Chart */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Task Status</h3>
        <PieChart width={300} height={250}>
          <Pie
            data={[
              { name: "Pending", value: summaryCounts.PENDING },
              { name: "Ongoing", value: summaryCounts.ONGOING },
              { name: "Completed", value: summaryCounts.COMPLETED },
            ]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {COLORS.map((color, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Bar Chart */}
      {employeeSummary.length > 0 && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
            Employee Task Summary
          </h3>
          <BarChart
            width={500}
            height={250}
            data={employeeSummary}
            margin={{ top: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#007bff" />
          </BarChart>
        </div>
      )}
    </div>
  );
}

export default Analytics;
