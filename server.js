const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Instagram Downloader Backend is Running!');
});

app.post('/api/fetch', async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url);
    res.json({ data: response.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
