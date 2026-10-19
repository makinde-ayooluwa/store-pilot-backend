
const axios = require("axios");

const initializePayment = async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !Number.isSafeInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid email and positive amount in kobo are required."
      });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: String(amount),
        currency: "NGN",
        callback_url: `${process.env.FRONTEND_URL}/payment/verify`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Paystack transaction initialized.",
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference
    });
  } catch (error) {
    console.error(
      "Paystack initialization error:",
      error.response?.data || error.message
    );

    return res.status(502).json({
      success: false,
      message: "Unable to initialize payment."
    });
  }
};

module.exports = { initializePayment };
