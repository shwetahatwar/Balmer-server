'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ttat = sequelize.define("ttat", {
    truckNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    outTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    driver: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loadStartTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loadEndTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    loadingTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inOutTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idleTime:{
      type:DataTypes.STRING,
      allowNull:false
    },
    createdBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.STRING,
      allowNull:true
    }
    
  });
  return Ttat;
};