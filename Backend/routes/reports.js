import multer from "multer";
import fs from "fs";
import exifParser from "exif-parser";
import path from "path";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  let suspiciousFlag = false;
  if (req.file) {
    const buffer = fs.readFileSync(req.file.path);
    try {
      const parser = exifParser.create(buffer);
      const result = parser.parse();
      if (!result.tags || !result.tags.CreateDate) suspiciousFlag = true;
    } catch {
      suspiciousFlag = true;
    }
  }
  const r = new Report({
    type: req.body.type,
    description: req.body.description,
    location: req.body.location,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    suspicious: suspiciousFlag
  });
  await r.save();
  res.status(201).json(r);
});

const reportSchema = new mongoose.Schema({
  type: String,
  description: String,
  location: String,
  imageUrl: String,
  suspicious: { type: Boolean, default: false },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});
