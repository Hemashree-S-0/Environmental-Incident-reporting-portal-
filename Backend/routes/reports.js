import express from "express";
import Report from "../models/Report.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const r = new Report(req.body);
  await r.save();
  res.status(201).json(r);
});

router.get("/", async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

export default router;
router.put("/:id", async (req, res) => {
  const updated = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(updated);
});
