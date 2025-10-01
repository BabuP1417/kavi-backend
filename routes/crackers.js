const express = require('express');
const router = express.Router();
const Cracker = require('../models/Cracker');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save in server/uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Public: list crackers
router.get('/', async (req, res) => {
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

// Protected: create cracker with image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, name, price } = req.body;
    if (!title || !name || !price) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const c = new Cracker({ title, name, price, imageUrl });
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update cracker
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, name, price } = req.body;
    const updateData = { title, name, price };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await Cracker.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Cracker not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete cracker
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Cracker.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Cracker not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
