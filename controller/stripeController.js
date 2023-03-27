
const express = require('express');
const models = require('../models');
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('sk_test_51JnLcFSCWP0clihbN4kP4NX4jDxzGBvuvzgc3itc84yKiT8yyfd6fhfInu5Y2m3ghBfuOysnk4jZYSo7YIxWMn4200wLTCrETJ');


async function createCustomer(req,res)
{
    console.log('in stripe controller create customer function');
   
   // Create a customer object to represent the user in Stripe
    const customer = await stripe.customers.create({
        email: req.body.email,
        description: 'Test customer', // token representing the user's payment information
    }).then(async(result)=>{
        console.log(result);
        var customerId = result.id;
       // var updateCustomerId = await models.userModel({stripe_customer_id:customerId},{where:{id:req.user}})

       const userData = new models.userModel({
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        stripe_customer_id:customerId
       }).save().then((data)=>{
            res.send({
                status:'success',
                error:null,
                data:customerId,
                message:"Customer created successfully."
            });
       }).catch((error)=>{
            res.send({
                status:'error',
                error:error.message,
                data:null,
                message:"Customer not created."
            });
       });
      
    }).catch((error)=>{
        res.send({
            status:'error',
            error:error.message,
            data:null,
            message:"Customer not created."
        });
    });
}//createUser


module.exports={
    createCustomer
}