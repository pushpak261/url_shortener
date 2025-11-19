//const express = require('express');
//const router = express.Router();
//const Link = require('../models/Link');
//const { isValidURL, isValidCode } = require('../utils/validation');
//
//
//function generateCode() {
//  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//  const length = Math.floor(Math.random() * 3) + 6; // 6, 7, or 8
//  let code = '';
//  for (let i = 0; i < length; i++) {
//    code += chars[Math.floor(Math.random() * chars.length)];
//  }
//  return code;
//}
//
//
//router.post('/', async (req, res) => {
//  try {
//    const { url, code } = req.body;
//
//
//    if (!url) {
//      return res.status(400).json({ error: 'URL is required' });
//    }
//
//
//    if (!isValidURL(url)) {
//      return res.status(400).json({ error: 'Invalid URL format' });
//    }
//
//
//    if (code && !isValidCode(code)) {
//      return res.status(400).json({ error: 'Invalid code format' });
//    }
//
//
//    let shortCode = code;
//    if (!shortCode) {
//      let attempts = 0;
//      do {
//        shortCode = generateCode();
//        const exists = await Link.findOne({ code: shortCode });
//        if (!exists) break;
//        attempts++;
//      } while (attempts < 10);
//
//      if (attempts >= 10) {
//        return res.status(500).json({ error: 'Failed to generate unique code' });
//      }
//    }
//
//    const existing = await Link.findOne({ code: shortCode });
//    if (existing) {
//      return res.status(409).json({ error: 'Code already exists' });
//    }
//
//
//    const newLink = await Link.create({ code: shortCode, url });
//
//    res.status(201).json({ success: true, link: newLink });
//  } catch (err) {
//    console.error('Create link error:', err);
//    res.status(500).json({ error: 'Server error' });
//  }
//});
//
//
//router.get('/', async (req, res) => {
//  try {
//    const links = await Link.find().sort({ createdAt: -1 });
//    res.json({ success: true, links });
//  } catch (err) {
//    console.error('List links error:', err);
//    res.status(500).json({ error: 'Server error' });
//  }
//});
//
//
//router.get('/:code', async (req, res) => {
//  try {
//    const link = await Link.findOne({ code: req.params.code });
//    if (!link) {
//      return res.status(404).json({ error: 'Link not found' });
//    }
//    res.json({ success: true, link });
//  } catch (err) {
//    console.error('Get link error:', err);
//    res.status(500).json({ error: 'Server error' });
//  }
//});
//
//
//router.delete('/:code', async (req, res) => {
//  try {
//    const link = await Link.findOneAndDelete({ code: req.params.code });
//    if (!link) {
//      return res.status(404).json({ error: 'Link not found' });
//    }
//
//    res.json({ success: true, message: 'Link deleted' });
//  } catch (err) {
//    console.error('Delete link error:', err);
//    res.status(500).json({ error: 'Server error' });
//  }
//});
//
//module.exports = router;



//implemented in-memory cache
const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const { isValidURL, isValidCode } = require('../utils/validation');

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 3) + 6;
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

router.post('/', async (req, res) => {
  try {
    const { url, code } = req.body;

    if (!url) return res.status(400).json({ error: 'URL is required' });
    if (!isValidURL(url)) return res.status(400).json({ error: 'Invalid URL format' });
    if (code && !isValidCode(code)) return res.status(400).json({ error: 'Invalid code format' });

    let shortCode = code;
    if (!shortCode) {
      let attempts = 0;
      do {
        shortCode = generateCode();
        const exists = await Link.findOne({ code: shortCode });
        if (!exists) break;
        attempts++;
      } while (attempts < 10);

      if (attempts >= 10) return res.status(500).json({ error: 'Failed to generate unique code' });
    }

    const existing = await Link.findOne({ code: shortCode });
    if (existing) return res.status(409).json({ error: 'Code already exists' });

    const newLink = await Link.create({ code: shortCode, url });

    if (req.cache) req.cache.set(shortCode, url);

    res.status(201).json({ success: true, link: newLink });
  } catch (err) {
    console.error('Create link error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json({ success: true, links });
  } catch (err) {
    console.error('List links error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ code: req.params.code });
    if (!link) return res.status(404).json({ error: 'Link not found' });
    res.json({ success: true, link });
  } catch (err) {
    console.error('Get link error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:code', async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({ code: req.params.code });
    if (!link) return res.status(404).json({ error: 'Link not found' });

    if (req.cache && req.cache.has(req.params.code)) req.cache.delete(req.params.code);

    res.json({ success: true, message: 'Link deleted' });
  } catch (err) {
    console.error('Delete link error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

