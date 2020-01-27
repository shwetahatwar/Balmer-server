'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispatchSlip = sequelize.define("dispatchslip", {
    dispatchSlipNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    truckId:{
      type:DataTypes.STRING,
      allowNull:false
    },
    depoId:{
      type:DataTypes.STRING,
      allowNull:false
    },
    status:{
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
    
  });
  return DispatchSlip;
};