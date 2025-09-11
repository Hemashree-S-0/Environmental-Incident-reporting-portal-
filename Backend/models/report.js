const reportSchema = new mongoose.Schema({
  type: String,
  description: String,
  location: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});
