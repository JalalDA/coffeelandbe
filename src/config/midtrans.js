const midtransClient = require('midtrans-client')

const snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : process.env.MIDTRANS_CLIENT_KEY
})

const createPayment = async (orderId, amount) => {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
    };
    try {
      const result = await snap.createTransaction(parameter);
      console.log({result});
      return {
        url: result.redirect_url,
      };
    } catch (error) {
      console.log(error);
    }
  };


  module.exports = {
    snap,
    createPayment
  }