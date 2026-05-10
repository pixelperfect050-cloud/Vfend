module.exports = async function handler(req, res) {
  res.json({ status: 'ok', ts: new Date().toISOString() });
};
