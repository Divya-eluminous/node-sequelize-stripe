const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const {verifyToken} = require('../middleware/auth');
const stripe = require('stripe')('sk_test_51JnLcFSCWP0clihbN4kP4NX4jDxzGBvuvzgc3itc84yKiT8yyfd6fhfInu5Y2m3ghBfuOysnk4jZYSo7YIxWMn4200wLTCrETJ');

const stripeController = require('../controller/stripeController');
console.log('in stripe router.js file');

router.post('/create-customer',stripeController.createCustomer);

module.exports=router;