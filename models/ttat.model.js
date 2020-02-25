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
      type: DataTypes.DATE,
      allowNull: true
    },
    outTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    driver: {
      type: DataTypes.STRING,
      allowNull: true
    },
    loadStartTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    loadEndTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    loadingTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    inOutTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idleTime:{
      type:DataTypes.DATE,
      allowNull:true
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