import React, { useState, useEffect } from "react";
import api from "../api";

export default function UserForm() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const res = await api.get("/reports");
    setReports(res.data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/reports", { type, description, location });
    setType(""); setDescription(""); setLocation("");
    fetchReports();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input className="border p-2 w-full" value={type} onChange={e => setType(e.target.value)} placeholder="Type" required />
        <input className="border p-2 w-full" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
        <input className="border p-2 w-full" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>

      <h2 className="text-lg font-semibold mb-3">Reports</h2>
      <ul className="space-y-2">
        {reports.map(r => (
          <li key={r._id} className="border p-2 rounded">
            <p><b>{r.type}</b> - {r.description}</p>
            <p className="text-sm text-gray-600">Location: {r.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
