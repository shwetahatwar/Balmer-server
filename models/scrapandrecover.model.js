'use strict';
module.exports = (sequelize, DataTypes) => {
  const ScarpandRecover = sequelize.define("scarpandrecover", {
    materialInwardId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comments:{
      type:DataTypes.STRING,
      allowNull:false
    },
    transactionType:{
      type:DataTypes.STRING,
      allowNull:true
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
  return ScarpandRecover;
};