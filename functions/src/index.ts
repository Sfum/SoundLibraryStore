// @ts-ignore
import * as functions from 'firebase-functions';
// @ts-ignore
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();
const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', {
  apiVersion: '2022-11-15',
});

export const createPaymentIntent = functions.https.onRequest(
  async (req, res) => {
    const { amount, currency } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).send({
        error: error.message,
      });
    }
  },
);
