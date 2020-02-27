import configureStripe from 'stripe';
import config from '../config';

const stripe = configureStripe(config.STRIPE_SECRET_KEY);

const postStripeCharge = res => (stripeErr, stripeRes) => {
  if (stripeErr) {
    res.status(500).json({ error: stripeErr });
  } else {
    return stripeRes;
  }
};

const payWithStripe = (req, res) => {
  if (config.env !== 'test') {
    const { description, source, currency, amount } = req.body;
    stripe.charges.create({ description, source, currency, amount }, postStripeCharge(res));
  }
};

export default payWithStripe;
