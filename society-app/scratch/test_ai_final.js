const axios = require('axios');

async function testAI() {
  const API_URL = 'https://society-backend-b004.onrender.com';
  const cb = Date.now();
  console.log(`Testing with cache buster: ${cb}`);
  
  try {
    const loginRes = await axios.post(`${API_URL}/api/auth/login?cb=${cb}`, {
      email: 'admin@society.com',
      password: 'admin123'
    });
    const token = loginRes.data.token;
    console.log('Login Successful.');

    const aiRes = await axios.post(`${API_URL}/api/ai/chat?cb=${cb}`, 
      { message: 'Hello' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('AI Response Received!');
    console.log('Text:', aiRes.data.response);
  } catch (error) {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Body:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAI();
