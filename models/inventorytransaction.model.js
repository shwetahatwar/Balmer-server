'use strict';
module.exports = (sequelize, DataTypes) => {
  const InventoryTransaction = sequelize.define("inventorytransaction", {
    transactionTimestamp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    performedBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    transactionType:{
      type: DataTypes.STRING,
      allowNull: false
    },
    materialInwardId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    batchNumber:{
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

  MaterialInward = sequelize.define("materialinward", {
    materialId: {
      type: DataTypes.INTEGER,
      references: {
          model: 'materials', 
          key: 'id',
       }
    },
    materialCode: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    batchNumber:{
      type:DataTypes.STRING,
      allowNull:false
    },
    serialNumber:{
      type:DataTypes.STRING,
      allowNull:false
    },
    isScrapped:{
      type:DataTypes.BOOLEAN,
      allowNull:true
    },
    isInward:{
      type:DataTypes.BOOLEAN,
      allowNull:true
    },
    dispatchSlipId:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    grossWeight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tareWeight: {
      type: DataTypes.FLOAT,
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
    
  });

  InventoryTransaction.belongsTo(MaterialInward, {foreignKey: 'materialInwardId',onDelete: 'CASCADE'})
  
  return InventoryTransaction;
};