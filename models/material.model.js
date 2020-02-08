'use strict';
module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define("material", {
    materialType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    materialCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    materialDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genericName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    packingType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    packSize: {
      type: DataTypes.STRING,
      allowNull: false
    },
    netWeight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    grossWeight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tareWeight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    UOM: {
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
  return Material;
};