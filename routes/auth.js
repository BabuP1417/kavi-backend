const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// For this starter we use credentials from env. In production, store admin in DB.
router.post('/login', async (req, res) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Missing fields' });


if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '8h' });
return res.json({ token });
}
return res.status(401).json({ message: 'Invalid credentials' });
});


module.exports = router;