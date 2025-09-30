const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/auth');
const crackerRoutes = require('./routes/crackers');
const buyNowRoutes = require('./routes/buyNow');


app.use('/api/auth', authRoutes);
app.use('/api/crackers', crackerRoutes);
app.use(buyNowRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI)
.then(() => {
console.log('MongoDB connected');
app.listen(PORT, () => console.log('Server running on', PORT));
})
.catch(err => console.error(err));