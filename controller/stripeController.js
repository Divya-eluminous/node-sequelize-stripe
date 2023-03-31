
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

async function createSubscriptionProduct(req,res)
{
    var productName= req.body.name;
    var description= req.body.description;
    const plan = await stripe.products.create({        
        name: productName,      
        description:description       
    }).then((result)=>{
        console.log(result);
        const productData={
            product_id:result.id,
            name:productName,
            description:description           
        }
        var stripePlan = new models.stripeProductModel(productData).save()
        .then((result)=>{
            res.send({
                status:'success',
                error:null,
                data:null,
                message:"Stripe product created successfully."
            });
        }).catch((error)=>{
            res.send({
                status:'error',
                error:error.message,
                data:null,
                message:"Product not created."
            });
        });
    }).catch((error)=>{
        res.send({
            status:'error',
            error:error.message,
            data:null,
            message:"Product not created."
        });
    });
}//createSubscriptionProduct

async function createSubscriptionPlan(req,res)
{
    var product_id= req.body.product_id;
    var amount= req.body.amount;
    var interval= req.body.interval;
    var currency= req.body.currency;
    var description= req.body.description;
    var interval_count= req.body.interval_count;

    var productInfo = await models.stripeProductModel.findOne({where:{id:product_id}});

    const plan = await stripe.plans.create({
        product:productInfo.product_id,
        amount: amount,
        currency: currency,
        interval: interval,
        interval_count:interval_count,
        metadata: {
        description:description
        }
    }).then((result)=>{
        console.log(result);
        const productData={
            plan_id:result.id,
            product_id:result.product,
            currency:result.currency,
            plan_interval:result.interval,
            amount:result.amount/100,
            interval_count:result.interval_count
        }
        var stripePlan = new models.stripePlansModel(productData).save()
        .then((result)=>{
            res.send({
                status:'success',
                error:null,
                data:null,
                message:"Stripe plan created successfully."
            });
        }).catch((error)=>{
            res.send({
                status:'error',
                error:error.message,
                data:null,
                message:"Plan not created."
            });
        });
    }).catch((error)=>{
        res.send({
            status:'error',
            error:error.message,
            data:null,
            message:"Plan not created."
        });
    });
}//createSubscriptionPlan

async function createSubscription(req,res)
{
    //console.log(req.user['userData']['id']);
    var loginId = req.user['userData']['id'];
    var customerId = req.body.customer_id;
    var planId = req.body.price_id;

    var planInfo = await models.stripePlansModel.findOne({where:{id:planId}});

    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: planInfo.plan_id }], // This is the ID of a product price.
    }).then((result)=>{
        console.log(result);
        if(result.status=="incomplete")
        {
            res.send({
                status:'error',
                error:'Subscription not created.',
                data:null,
                message:"Stripe subscription not created,payment not done."
            });
        }
        else
        {
            res.send({
                status:'success',
                error:null,
                data:null,
                message:"Stripe subscription created successfully."
            });
        }
       
    }).catch((error)=>{
        res.send({
            status:'error',
            error:error.message,
            data:null,
            message:"Stripe subscription not created."
        });
    });
}//createSubscription

module.exports={
    createCustomer,
    createSubscriptionProduct,
    createSubscriptionPlan,
    createSubscription
}