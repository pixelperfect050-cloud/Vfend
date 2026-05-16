const axios = require('axios');

async function testAI() {
  const API_URL = 'https://society-backend-b004.onrender.com';
  console.log('Testing Login...');
  try {
    const loginRes = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@society.com',
      password: 'admin123'
    });
    const token = loginRes.data.token;
    console.log('Login Successful, token received.');

    console.log('Testing AI Chat...');
    const aiRes = await axios.post(`${API_URL}/api/ai/chat`, 
      { message: 'Hello' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('AI Response:', aiRes.data.response);
  } catch (error) {
    console.error('Test Failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data));
    } else {
      console.error('Error Message:', error.message);
    }
  }
}

testAI();
