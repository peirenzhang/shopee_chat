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
    url: "https://seller.shopee.tw/webchat/api/v1.2/mini/messages?_uid=0-1599470932&_v=8.8.9&csrf_token=9d3m6G1qEfCwYYYb%2FdP%2BNw%3D%3D&SPC_CDS_CHAT=1b1b9b1d-ba58-4bc6-abe6-22912d90cdef&x-shop-region=TW&_api_source=pcmall&uuid=d23ffd9c-2b05-4909-b5aa-e3da160be2ac",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    data: {
      request_id: "2a971fab-bf4b-4ba9-a8d1-16bcba8d26c4",
      to_id: 4821226,
      type: "text",
      content: {
        text: message,
        uid: "2c212b95-d914-4363-bfbc-f54644eb2d12"
      },
      shop_id: parseInt(shopId, 10),
      chat_send_option: {
        force_send_cancel_order_warning: false,
        comply_cancel_order_warning: false
      },
      entry_point: "shop_entry_point",
      choice_info: {
        real_shop_id: null
      },
      biz_id: 0,
      conversation_id: "20707008012724472",
      source: "pc_mall",
      re_policy: {
        dfp_access_f: "5Un8m7tLR8a0Xi0j6u5i1A==|OBe0/Ugp3kyz1cql/6Iu9ppBovhJWQh1JfZAwE7ZD5YRqFyTPT7b5e9ZNg/SsX8j28bpwcruTSuIuEY=|ElbnbzrenKt1dQyv|08|3"
      }
    }
  };

  axios(settings)
    .then(response => res.json(response.data))
    .catch(error => res.status(500).json({ error: error.message }));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
