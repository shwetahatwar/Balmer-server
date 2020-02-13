'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispatchSlipMaterialList = sequelize.define("dispatchslipmateriallist", {
    dispatchSlipId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    batchNumber:{
      type: DataTypes.STRING,
      allowNull: false
    },
    numberOfPacks:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    materialCode:{
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
    createdBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.STRING,
      allowNull:true
    }
  });

  DispatchSlipMaterialList.belongsTo(DispatchSlip, {foreignKey: 'dispatchSlipId',onDelete: 'CASCADE'})
  // DispatchSlipMaterialList.belongsTo(Material, {foreignKey: 'materialCode',onDelete: 'CASCADE'})
  return DispatchSlipMaterialList;
};