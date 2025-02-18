const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koneksi ke MongoDB (ganti URL dengan MongoDB Anda)
mongoose.connect('mongodb://localhost:27017/solarpanel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema dan Model MongoDB
const dataSchema = new mongoose.Schema({
  solarVoltage: Number,
  batteryVoltage: Number,
  solarCurrent: Number,
  batteryCurrent: Number,
  timestamp: { type: Date, default: Date.now },
});

const Data = mongoose.model('Data', dataSchema);

// Endpoint untuk menyimpan data
app.post('/data', async (req, res) => {
  try {
    const newData = new Data(req.body);
    await newData.save();
    res.status(200).send('Data saved');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Endpoint untuk mengambil data
app.get('/data', async (req, res) => {
  try {
    const data = await Data.find().sort({ timestamp: -1 }).limit(100); // Ambil 100 data terbaru
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});