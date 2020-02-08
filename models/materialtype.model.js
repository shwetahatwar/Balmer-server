'use strict';
module.exports = (sequelize, DataTypes) => {
  const MaterialType = sequelize.define("materialtype", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    createdBy:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.INTEGER,
      allowNull:true
    }
    
  });
  return MaterialType;
};