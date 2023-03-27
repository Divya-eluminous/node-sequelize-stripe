const jwt = require('jsonwebtoken');
const db = require('../db/database');
const allModels = require('../models');

function generateToken(userData)
{
    // const token = jwt.sign({userData}, 'Mysecretkey', { expiresIn: '1h' });
    const token = jwt.sign({userData}, 'Mysecretkey', { expiresIn: '5m' });
    return token;
}
async function verifyToken(req,res,next){
    const authHeader = req.headers.authorization;
     var headToken;
    if(authHeader)
    {
         headToken = authHeader.split(' ')[1];
     }
    if(!headToken){
        return res.status(403).send('Token is required');
    }    
    try{
        let checkLoginUser = await allModels.userModel.findOne({where:{id:req.params.id},attributes:['id','access_token']});
        if(checkLoginUser){
            var dbAccessToken = checkLoginUser['access_token'];
           if(dbAccessToken===headToken)
           {
            const decode =  jwt.verify(headToken, 'Mysecretkey');
            req.user = decode;
            return next();
           }else{
            return res.status(401).send({message:'Invalid token'});
           }
        }//if
        else{
            return res.status(401).send({message:'Invalid token'});
        }
       
    }catch(err){
        return res.status(401).send({message:'Invalid token : '+err});
    }
    return next();
}


module.exports ={
    generateToken,
    verifyToken
}