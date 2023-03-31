const { Sequelize, DataTypes,sequelize  } = require('sequelize');
module.exports = (sequelize, Sequelize) => {

const stripeSubscriptionModel = sequelize.define('stripe_products', {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    } 
  },
  {
    // Other model options go here
    freezeTableName: true,
    timestamps: true,
    tableName: 'stripe_subscriptions',
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
  }
 );
 return stripeSubscriptionModel;
};
  
