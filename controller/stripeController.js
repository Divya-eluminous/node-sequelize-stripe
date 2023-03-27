
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
        source: 'tok_visa', // token representing the user's payment information
    }).then((result)=>{
       // console.log(result);
        res.send({
            status:'success',
            error:null,
            data:null,
            message:"Customer created successfully."
        });
    }).catch((error)=>{
        res.send({
            status:'error',
            error:null,
            data:null,
            message:"Customer not created."
        });
    });
}//createUser


module.exports={
    createCustomer
}