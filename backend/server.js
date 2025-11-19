//const express = require('express');
//const mongoose = require('mongoose');
//const cors = require('cors');
//require('dotenv').config();
//
//const Link = require('./models/Link');
//const { isValidCode } = require('./utils/validation');
//
//const app = express();
//const PORT = process.env.PORT || 5000;
//
//app.use(cors());
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//
//
//mongoose.connect(process.env.MONGODB_URI)
//  .then(() => console.log('MongoDB connected'))
//  .catch(err => {
//    console.error('MongoDB connection error:', err);
//    process.exit(1);
//  });
//
//
//app.get('/healthz', (req, res) => {
//  res.json({ ok: true, version: "1.0" });
//});
//
//
//const linksRoute = require('./routes/links');
//app.use('/api/links', linksRoute);
//
//
//app.get('/:code', async (req, res) => {
//  const code = req.params.code;
//
//
//  if (['api', 'healthz', 'code', 'favicon.ico'].includes(code)) {
//    return res.status(404).json({ error: 'Not found' });
//  }
//
//
//  if (!isValidCode(code)) {
//    return res.status(404).json({ error: 'Link not found' });
//  }
//
//  try {
//    const link = await Link.findOne({ code });
//    if (!link) {
//      return res.status(404).json({ error: 'Link not found' });
//    }
//
//
//    link.clicks++;
//    link.lastClicked = new Date();
//    await link.save();
//
//    return res.redirect(302, link.url);
//
//  } catch (err) {
//    console.error('Redirect error:', err);
//    return res.status(500).json({ error: 'Internal server error' });
//  }
//});
//
//
//app.use((req, res) => {
//  res.status(404).json({ error: 'Route not found' });
//});
//
//
//app.listen(PORT, () => {
//  console.log(`Server running on port ${PORT}`);
//});


//implemented in-memory cache
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Link = require('./models/Link');
const { isValidCode } = require('./utils/validation');

const app = express();
const PORT = process.env.PORT || 5000;

const cache = new Map();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
  })
);

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

app.use((req, res, next) => {
  req.cache = cache;
  next();
});

const linksRoute = require('./routes/links');
app.use('/api/links', linksRoute);

app.get('/:code', async (req, res) => {
  const code = req.params.code;

  if (['api', 'healthz', 'code', 'favicon.ico'].includes(code)) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (!isValidCode(code)) {
    return res.status(404).json({ error: 'Link not found' });
  }

  try {
    if (cache.has(code)) {
      const url = cache.get(code);
      Link.findOneAndUpdate(
        { code },
        { $inc: { clicks: 1 }, lastClicked: new Date() }
      ).catch(err => console.error('Background click update failed:', err));

      return res.redirect(302, url);
    }

    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: 'Link not found' });

    link.clicks++;
    link.lastClicked = new Date();
    await link.save();

    cache.set(code, link.url);

    return res.redirect(302, link.url);

  } catch (err) {
    console.error('Redirect error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

