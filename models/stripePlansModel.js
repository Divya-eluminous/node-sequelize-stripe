const { Sequelize, DataTypes,sequelize  } = require('sequelize');
module.exports = (sequelize, Sequelize) => {

const stripePlansModel = sequelize.define('stripe_plans', {
    // Model attributes are defined here
    id:
    {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plan_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plan_interval: {
      type: DataTypes.STRING,
      allowNull: true      
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: true      
    },
    interval_count:{
      type:DataTypes.TEXT,
      allowNull:true
    }   
  },
  {
    // Other model options go here
    freezeTableName: true,
    timestamps: true,
    tableName: 'stripe_plans',
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
  }
 );
 return stripePlansModel;
};
  
