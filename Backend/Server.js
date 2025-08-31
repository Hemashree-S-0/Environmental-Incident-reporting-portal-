import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import exifParser from "exif-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const reportSchema = new mongoose.Schema({
  type: String,
  description: String,
  location: String,
  imageUrl: String,
  suspicious: { type: Boolean, default: false },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});
const Report = mongoose.model("Report", reportSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

app.post("/api/reports", upload.single("image"), async (req, res) => {
  try {
    let suspiciousFlag = false;
    if (req.file) {
      const buffer = fs.readFileSync(req.file.path);
      try {
        const parser = exifParser.create(buffer);
        const result = parser.parse();
        if (!result.tags || !result.tags.CreateDate) suspiciousFlag = true;
      } catch (err) {
        suspiciousFlag = true;
      }
    }
    const newReport = new Report({
      type: req.body.type,
      description: req.body.description,
      location: req.body.location,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      suspicious: suspiciousFlag
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit report" });
  }
});

app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

app.put("/api/reports/:id", async (req, res) => {
  try {
    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
