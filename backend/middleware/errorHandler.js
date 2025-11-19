module.exports = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Invalid code or data format' });
  }

  res.status(500).json({ error: 'Something went wrong!' });
};
