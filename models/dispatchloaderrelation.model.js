'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispatchLoaderRelation = sequelize.define("dispatchloaderrelation", {
    dispatchId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId:{
      type: DataTypes.STRING,
      allowNull: false
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

  DispatchSlip = sequelize.define("dispatchslip", {
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

  DispatchLoaderRelation.belongsTo(DispatchSlip, {foreignKey: 'dispatchId',onDelete: 'CASCADE'})
  return DispatchLoaderRelation;
};