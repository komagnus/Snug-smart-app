const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

const weatherLinkBaseUrl = 'https://api.weatherlink.com/v2';

app.use(express.json());
app.use(cors());

app.get('/weatherlink/:stationId', async (req, res) => {
  const { stationId } = req.params;
  const { apiKey, apiSecret } = req.query;
  const apiUrl = `${weatherLinkBaseUrl}/current/${stationId}?api-key=${apiKey}`;
  try {
    console.log(apiUrl);
    const response = await axios.get(apiUrl, {
      headers: {
        'x-api-secret': apiSecret
      }
    });
    res.json(response.data);
  } catch (error) {
    console.log(error);
    console.error('Error fetching WeatherLink data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
