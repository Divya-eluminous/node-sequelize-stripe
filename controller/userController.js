
const express = require('express');
const models = require('../models');
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('sk_test_51JnLcFSCWP0clihbN4kP4NX4jDxzGBvuvzgc3itc84yKiT8yyfd6fhfInu5Y2m3ghBfuOysnk4jZYSo7YIxWMn4200wLTCrETJ');


async function getUserList(req,res)
{
//    console.log(req.params.id);
    console.log('in user controller get user list function');
    const userList = await models.userModel.findAll({
        attributes:['id','first_name','last_name','email']
    }).then((result)=>{
       // console.log(result);
        res.send({
            status:'success',
            error:null,
            data:result,
            message:"Users found successfully."
        });
    }).catch((error)=>{
        res.send({
            status:'error',
            error:null,
            data:null,
            message:"Users not found."
        });
    });
}


async function createUser(req,res)
{
    console.log('in user controller create user function');
    const userData ={
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        access_token:''
    }
    userData.password = await bcrypt.hash(req.body.password,10);
    const data = new models.userModel(userData);
    data.save().then(async(result)=>{

       const customer = await stripe.customers.create({
        email: req.body.email,
        description: req.body.first_name+' '+req.body.last_name, // token representing the user's payment information
       }).then(async(stripeResult)=>{  

             // Create a payment method and attach it to the customer
            const paymentMethods = await stripe.paymentMethods.create({
                type: 'card',
                card: {
                number: '4242424242424242',
                exp_month: 12,
                exp_year: 2030,
                cvc: '123',
                },
            });
            console.log(paymentMethods);
            await stripe.paymentMethods.attach(paymentMethods.id, { customer: stripeResult.id });

            // Set the payment method as the customer's default payment method
            await stripe.customers.update(stripeResult.id, {
                invoice_settings: {
                default_payment_method: paymentMethods.id,
                },
            }).then(async(resul)=>{
                    //console.log(stripeResult);
                    var updateCustomerId = await models.userModel.update({stripe_customer_id:stripeResult.id,payment_method:paymentMethods.id},{where:{id:result.id}})
                    .then((data)=>{    
                            res.send({
                                status:'success',
                                error:null,
                                data:null,
                                message:"Users created successfully."
                            });
                        }).catch((error)=>{
                            res.send({
                                status:'error',
                                error:error.message,
                                data:null,
                                message:"Users not created."
                            });
                        }); 
            }).catch((error)=>{
                res.send({
                    status:'error',
                    error:error.message,
                    data:null,
                    message:"Users not created."
                });
            }); 

        
      }).catch((error)=>{
            res.send({
                status:'error',
                error:error.message,
                data:null,
                message:"Users not created."
            });
      }); 
    }).catch((error)=>{
        res.send({
            status:'error',
            error:error.message,
            data:null,
            message:"Users not created."
        });
    });
}//createUser

async function login(req,res)
{
    let username = req.body.email;
    let password = req.body.password;
    const userExists = await models.userModel.findOne({
        where:{
            email:username
        }
    }).then(async(result)=>{        
           let dbPassword = result.password;
           const compare = await bcrypt.compare(password,dbPassword);
           if(compare)
           {
                const token = generateToken(result);
                const updateToken = models.userModel.update({access_token:token},{where:{id:result['id']}}).then((data)=>{
                    const userLoginData={
                        id:result['id'],
                        first_name:result['first_name'],
                        last_name:result['last_name'],
                        email:result['email'],
                        token:token
                    }
                    res.send({
                        status:'success',
                        error:null,
                        data:userLoginData,
                        message:"Users login successfully."
                    });
                }).catch((error)=>{
                    res.send({
                        status:'error',
                        error:error.message,
                        data:userLoginData,
                        message:"Unable to login."
                    });
                });               
           }
           else{
                res.send({
                    status:'error',
                    error:null,
                    data:null,
                    message:"Incorrect username or password."
                });
           }
    }).catch((error)=>{
        res.send({
            status:'error',
            error:error.message,
            data:null,
            message:"unable to login."
        });
    });
}//login

module.exports={
    getUserList,
    createUser,
    login
}