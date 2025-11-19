function isValidURL(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }

  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname !== '';
  } catch (e) {
    return false;
  }
}

function isValidCode(code) {
  if (!code || typeof code !== 'string') {
    return false;
  }
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

module.exports = { isValidURL, isValidCode };