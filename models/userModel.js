const { Sequelize, DataTypes,sequelize  } = require('sequelize');
module.exports = (sequelize, Sequelize) => {

const userModel = sequelize.define('User', {
    // Model attributes are defined here
    id:
    {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false      
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false      
    },
    access_token:{
      type:DataTypes.TEXT,
      allowNull:false
    }
  },
  {
    // Other model options go here
    freezeTableName: true,
    timestamps: true,
    tableName: 'users',
    createdAt:"created_at",
    updatedAt:"updated_at",
    deletedAt:"deleted_at"
  }
 );
 return userModel;
};
  
