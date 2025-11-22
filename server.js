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
  const { jwt, shopId, toId, message } = req.body;

  const settings = {
    url: "https://seller.shopee.tw/webchat/api/v1.2/mini/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    data: {
      request_id: "796db710-d0c4-45e2-8876-7c08e7e6d9c5",
      to_id: parseInt(toId, 10),
      type: "text",
      content: {
        text: message,
        uid: "84b495ed-375f-484e-9b28-823779f5e162"
      },
      shop_id: parseInt(shopId, 10)
    }
  };

  axios(settings)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ 
        error: error.message,
        details: error.response?.data,
        status: error.response?.status
      });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
