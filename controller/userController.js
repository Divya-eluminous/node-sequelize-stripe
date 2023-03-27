
const express = require('express');
const models = require('../models');
const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');


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
        email:req.body.email
    }
    userData.password = await bcrypt.hash(req.body.password,10);

    const data = new models.userModel(userData);
    data.save().then((result)=>{
       // console.log(result);
        res.send({
            status:'success',
            error:null,
            data:null,
            message:"Users created successfully."
        });
    }).catch((error)=>{
        res.send({
            status:'error',
            error:null,
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