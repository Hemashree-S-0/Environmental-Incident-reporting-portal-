import React, { useState } from "react";
import UserForm from "./components/UserForm";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [view, setView] = useState("user");
  return (
    <div className="p-6">
      <header className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Environmental Incident Portal</h1>
        <div>
          <button onClick={() => setView("user")} className="mr-2">User</button>
          <button onClick={() => setView("admin")}>Admin</button>
        </div>
      </header>
      {view === "user" ? <UserForm /> : <AdminDashboard />}
    </div>
  );
}
