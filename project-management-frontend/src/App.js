import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import MyTasks from './components/Dashboard/MyTasks';
import MonthlyGoals from './components/Dashboard/MonthlyGoals';
import Analytics from './components/Dashboard/Analytics';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard with nested pages */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="monthly-goals" element={<MonthlyGoals />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
