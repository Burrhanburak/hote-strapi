const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_BASE_URL,
});

app.post("/api/payment", (req, res) => {
  const {
    price,
    paidPrice,
    currency,
    basketId,
    paymentCard,
    buyer,
    shippingAddress,
    billingAddress,
    basketItems,
  } = req.body;

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: "123456789",
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    price: price,
    installment: "1",
    paidPrice: paidPrice,
    currency: currency,
    basketId: basketId,
    paymentCard: paymentCard,
    buyer: buyer,
    shippingAddress: shippingAddress,
    billingAddress: billingAddress,
    basketItems: basketItems,
  };

  iyzipay.payment.create(request, (err, result) => {
    if (err) {
      console.error("Payment error:", err);
      return res.status(500).json({ error: "Payment processing failed." });
    }
    console.log("Payment result:", result);
    res.status(200).json(result);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
