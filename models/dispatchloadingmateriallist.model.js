'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispatchLoadingMaterialList = sequelize.define("dispatchloadingmateriallist", {
    dispatchId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    materialCode:{
      type: DataTypes.STRING,
      allowNull: false
    },
    batchNumber:{
      type: DataTypes.STRING,
      allowNull: false
    },
    serialNumber:{
      type: DataTypes.STRING,
      allowNull: false
    },
    userId:{
      type: DataTypes.STRING,
      allowNull: false
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

  DispatchSlip = sequelize.define("dispatchslip", {
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
  });

  DispatchLoadingMaterialList.belongsTo(DispatchSlip, {foreignKey: 'dispatchId',onDelete: 'CASCADE'})
  return DispatchLoadingMaterialList;
};