const express = require("express");
const router = express.Router();
const Cracker = require("../models/Cracker");
const auth = require("../middleware/auth");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Multer memory storage (keep file in memory, not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public: list crackers
router.get("/", async (req, res) => {
  const { title } = req.query;
  const filter = title ? { title } : {};
  try {
    const list = await Cracker.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cracker = await Cracker.findById(req.params.id);
    if (!cracker) return res.status(404).json({ msg: "Product not found" });
    res.json(cracker);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Create cracker
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, name, price } = req.body;
    if (!title || !name || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let imageUrl = null;

    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=2c698535b7a0e0fccfb99be6786aeb13`,
        new URLSearchParams({
          image: base64Image,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      imageUrl = response.data.data.url;
    }

    const c = new Cracker({ title, name, price, imageUrl });
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
    res.status(500).json({ message: "Image upload failed", error: err.response?.data || err.message });
  }
});

// Update cracker
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, name, price } = req.body;
    const updateData = { title, name, price };

    if (req.file) {
      const base64Image = req.file.buffer.toString("base64");

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=2c698535b7a0e0fccfb99be6786aeb13`,
        new URLSearchParams({
          image: base64Image,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      updateData.imageUrl = response.data.data.url;
    }

    const updated = await Cracker.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Cracker not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err.response?.data || err.message);
    res.status(500).json({ message: "Update failed", error: err.response?.data || err.message });
  }
});

// Delete cracker
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Cracker.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Cracker not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
