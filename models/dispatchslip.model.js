'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispatchSlip = sequelize.define("dispatchslip", {
    dispatchSlipNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    truckId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    depoId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    dispatchSlipStatus:{
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
  }),

  Ttat = sequelize.define("ttat", {
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
      allowNull: false
    },
    outTime: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    driver: {
      type: DataTypes.STRING,
      allowNull: false
    },
    consignmentLocation: {
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
    
  }),

  Depot = sequelize.define("depot", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    location:{
      type: DataTypes.STRING,
      allowNull: false
    },
    status:{
      type:DataTypes.BOOLEAN,
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
  DispatchSlip.belongsTo(Ttat, {foreignKey: 'truckId',onDelete: 'CASCADE'});
  DispatchSlip.belongsTo(Depot, {foreignKey: 'depoId',onDelete: 'CASCADE'})
  return DispatchSlip;
};