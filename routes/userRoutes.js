const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const {verifyToken} = require('../middleware/auth');

const userController = require('../controller/userController');
console.log('in user router.js file');

router.get('/list/:id',verifyToken,userController.getUserList);
router.post('/create',userController.createUser);
router.post('/login',userController.login);

module.exports=router;