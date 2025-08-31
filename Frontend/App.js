import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const res = await axios.get("http://localhost:5000/api/reports");
    setReports(res.data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", type);
    formData.append("description", description);
    formData.append("location", location);
    if (image) formData.append("image", image);
    await axios.post("http://localhost:5000/api/reports", formData);
    fetchReports();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/reports/${id}`, { status });
    fetchReports();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Environmental Monitoring Portal</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} className="border p-2 w-full" />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full" />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 w-full" />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white p-2">Submit Report</button>
      </form>

      <h2 className="text-lg font-semibold mt-6">Reports</h2>
      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r._id} className="border p-3 rounded">
            <p><b>Type:</b> {r.type}</p>
            <p><b>Description:</b> {r.description}</p>
            <p><b>Location:</b> {r.location}</p>
            <p><b>Status:</b> {r.status}</p>
            <p><b>Suspicious:</b> {r.suspicious ? "Yes" : "No"}</p>
            {r.imageUrl && <img src={`http://localhost:5000${r.imageUrl}`} alt="" className="w-40 h-40 object-cover mt-2" />}
            <div className="flex gap-2 mt-2">
              <button onClick={() => updateStatus(r._id, "In Progress")} className="bg-yellow-500 text-white px-2">In Progress</button>
              <button onClick={() => updateStatus(r._id, "Resolved")} className="bg-green-500 text-white px-2">Resolved</button>
              <button onClick={() => updateStatus(r._id, "Rejected")} className="bg-red-500 text-white px-2">Rejected</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
