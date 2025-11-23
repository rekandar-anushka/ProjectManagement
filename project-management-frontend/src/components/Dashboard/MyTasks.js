import React, { useEffect, useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { BASE_URL } from "../../config";
function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "", dueDate: "" });
  const [editingTask, setEditingTask] = useState(null);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

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

  const fetchTasks = useCallback(async () => {
    try {
      const res =
        role === "MANAGER"
          ? await axios.get(`${BASE_URL}/api/tasks`)
          : await axios.get(`${BASE_URL}/api/tasks/user/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tasks");
    }
  }, [role, userId]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users`);
      const employees = res.data.filter((u) => u.role === "EMPLOYEE");
      setUsers(employees);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchUsersMap();
    fetchTasks();
    if (role === "MANAGER") fetchEmployees();
  }, [fetchUsersMap, fetchTasks, fetchEmployees, role]);

  const createTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.assignedTo || !newTask.dueDate)
      return alert("All fields are required");
    try {
      await axios.post(`${BASE_URL}/api/tasks`, newTask);
      setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async () => {
    if (!editingTask.title || !editingTask.description || !editingTask.assignedTo || !editingTask.dueDate)
      return alert("All fields are required");
    try {
      await axios.put(`${BASE_URL}/api/tasks/${editingTask.id}`, editingTask);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = {
    PENDING: tasks.filter((t) => t.status === "PENDING"),
    ONGOING: tasks.filter((t) => t.status === "ONGOING"),
    COMPLETED: tasks.filter((t) => t.status === "COMPLETED"),
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    if (role !== "EMPLOYEE") return;
    updateStatus(draggableId, destination.droppableId);//#d4edda
  };

  const columnColors = {
    PENDING: "#f8d7da",
    ONGOING: "#fff3cd",
    COMPLETED: "#d4edda",
  };

  return (
    <div>
      {/* Manager Task Form */}
      {role === "MANAGER" && (
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <h3>Create Task</h3>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <select
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Assign to...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <button
            onClick={createTask}
            style={{ padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#007bff", color: "#fff", fontWeight: "600", cursor: "pointer", marginTop: "10px" }}
          >
            Create Task
          </button>
        </div>
      )}

      {/* Drag & Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {["PENDING", "ONGOING", "COMPLETED"].map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    padding: "20px",
                    borderRadius: "12px",
                    backgroundColor: columnColors[status],
                    minHeight: "400px",
                  }}
                >
                  <h3 style={{ textAlign: "center" }}>
                    {status} ({columns[status].length})
                  </h3>
                  {columns[status].map((task, index) => (
                    <Draggable draggableId={task.id.toString()} index={index} key={task.id} isDragDisabled={role !== "EMPLOYEE"}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            backgroundColor: "#fff",
                            padding: "15px",
                            marginBottom: "15px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <h4>{task.title}</h4>
                          <p>{task.description}</p>
                          <small>Assigned: {usersMap[task.assignedTo] || "Unassigned"}</small>
                          <br />
                          <small>Due: {task.dueDate}</small>
                          {role === "MANAGER" && (
                            <div style={{ marginTop: "10px" }}>
                              <button onClick={() => setEditingTask(task)} style={{ marginRight: "10px" }}>
                                Edit
                              </button>
                              <button onClick={() => deleteTask(task.id)}>Delete</button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Edit Task Modal */}
      {editingTask && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "12px", width: "400px" }}>
            <h3>Edit Task</h3>
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="text"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="date"
              value={editingTask.dueDate}
              onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
              style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <select
              value={editingTask.assignedTo}
              onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
              style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%", borderRadius: "6px", border: "1px solid #ccc" }}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={updateTask}
                style={{ padding: "10px 15px", borderRadius: "6px", border: "none", backgroundColor: "#007bff", color: "#fff", cursor: "pointer" }}
              >
                Save
              </button>
              <button
                onClick={() => setEditingTask(null)}
                style={{ padding: "10px 15px", borderRadius: "6px", border: "none", backgroundColor: "#6c757d", color: "#fff", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTasks;
