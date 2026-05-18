export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { action, ...data } = req.body;
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK || 'https://script.google.com/macros/s/AKfycbxycpBqrh3loOZiw3nc9G204WTdlIe2pPfQlXrRHeJPgvvyvhvw42LO5Sw7PijZHvVB_A/exec';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data })
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error('Sheets sync error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
