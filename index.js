const express = require('express');
const app = express();
const PORT="5000";
const db = require('./db/database');
const stripe = require('stripe')('sk_test_51JnLcFSCWP0clihbN4kP4NX4jDxzGBvuvzgc3itc84yKiT8yyfd6fhfInu5Y2m3ghBfuOysnk4jZYSo7YIxWMn4200wLTCrETJ');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const models = require('./models/index');

require('./routes/route')(app);


app.post('/webhook', async (req, res) => {
    console.log('in webhook.....');
    // Get the Stripe signature header and event data from the request body
    const signature = req.headers['stripe-signature'];
    const event = req.body;
    
  try {
    // Verify the signature of the webhook using the Stripe API
    const verifiedEvent = stripe.webhooks.constructEvent(
      event,
      signature,
      'YOUR_STRIPE_WEBHOOK_SECRET'
    );

    // Handle the event data
    console.log('Received event:', verifiedEvent.type);
    // ...
  } catch (err) {
    console.log(err);
    res.status(400).send('Webhook Error:' + err.message);
  }
  res.sendStatus(200);
});


app.listen(PORT, console.log(`Server started on port ${PORT}`));
