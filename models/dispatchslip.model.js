'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispatchSlip = sequelize.define("dispatchslip", {
    dispatchSlipNumber: {
      type: DataTypes.STRING,
      allowNull: false
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
    createdBy:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.INTEGER,
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
      type:DataTypes.INTEGER,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.INTEGER,
      allowNull:true
    }
    
  }),

  Depot = sequelize.define("depot", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
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
      type:DataTypes.INTEGER,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.INTEGER,
      allowNull:true
    }
    
  });
  DispatchSlip.belongsTo(Ttat, {foreignKey: 'truckId',onDelete: 'CASCADE'});
  DispatchSlip.belongsTo(Depot, {foreignKey: 'depoId',onDelete: 'CASCADE'})
  return DispatchSlip;
};