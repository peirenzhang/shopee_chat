const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Adjust fallback route to explicitly match root requests
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Add a route to handle Shopee API requests
app.post('/api/send-message', (req, res) => {
  const { jwt, shopId, message } = req.body;

  const settings = {
    url: "https://seller.shopee.tw/webchat/api/v1.2/mini/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    data: {
      request_id: "0d5bb9c6-cae7-4444-afc2-a4ccd86d14f7",
      to_id: 16099576,
      type: "text",
      content: {
        text: message,
        uid: "44f5f80d-5395-49b6-bcd4-6bdab0dd1b3a"
      },
      shop_id: parseInt(shopId, 10)
    }
  };

  axios(settings)
    .then(response => res.json(response.data))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
