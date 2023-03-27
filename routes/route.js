const express = require('express');
const router = express.Router();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const userRoute = require('../routes/userRoutes');
const stripeRoute = require('../routes/stripeRoutes');

module.exports = function(app){
   console.log('in router.js file');

  app.use('/api/user/',userRoute);
  app.use('/api/stripe/',stripeRoute);

}