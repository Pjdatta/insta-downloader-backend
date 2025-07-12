const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://insta-story-downloader-ten.vercel.app',
}));
app.use(express.json());

app.post('/download', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const scriptTag = $('script[type="application/ld+json"]').html();
    if (!scriptTag) {
      return res.status(404).json({ success: false, error: "Media not found (ld+json missing)" });
    }

    const jsonData = JSON.parse(scriptTag);

    const mediaUrl = jsonData.contentUrl;
    const type = jsonData['@type'] === 'VideoObject' ? 'video' : 'image';

    if (mediaUrl) {
      res.json({ success: true, mediaUrl, type });
    } else {
      res.json({ success: false, error: "Media not found" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});