import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const res = await api.get("/reports");
    setReports(res.data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/reports/${id}`, { status });
    fetchReports();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Admin Dashboard</h2>
      <ul className="space-y-2">
        {reports.map(r => (
          <li key={r._id} className="border p-2 rounded">
            <p><b>{r.type}</b> - {r.description}</p>
            <p>Location: {r.location}</p>
            <p>Status: {r.status || "Pending"}</p>
            <select value={r.status || "Pending"} onChange={(e) => updateStatus(r._id, e.target.value)}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Rejected</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
