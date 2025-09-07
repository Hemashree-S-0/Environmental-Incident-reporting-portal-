import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  type: String,
  description: String,
  location: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Report", reportSchema);
