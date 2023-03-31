const { Sequelize, DataTypes  } = require('sequelize');

const dbFile = require('../db/database');
const sequelize = new Sequelize(dbFile.DATABASE, dbFile.USERNAME, dbFile.PASSWORD, {
    host: dbFile.HOST,
    dialect:dbFile.dialect,
    logging:true
  });
  
sequelize.authenticate().then(()=>{
    console.log('Connection has been established successfully.');
}).catch((error)=> {
    console.error('Unable to connect to the database:', error);
});

// sync models
const db={};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.userModel = require('./userModel')(sequelize,DataTypes);
db.stripePlansModel = require('./stripePlansModel')(sequelize,DataTypes);
db.stripeProductModel = require('./stripeProductModel')(sequelize,DataTypes);

db.sequelize.sync({ force: false,alter:false }).then(()=>{
    console.log("All models were synchronized successfully.");
});

module.exports = db;