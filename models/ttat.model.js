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
      type: DataTypes.BIGINT,
      allowNull: true
    },
    outTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    driver: {
      type: DataTypes.STRING,
      allowNull: true
    },
    loadStartTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    loadEndTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    loadingTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    inOutTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    idleTime:{
      type:DataTypes.BIGINT,
      allowNull:true
    },
    driverMobileNumber:{
      type:DataTypes.STRING,
      allowNull:true
    },
    transportor:{
      type:DataTypes.STRING,
      allowNull:true
    },
    outRemarks:{
      type:DataTypes.STRING,
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