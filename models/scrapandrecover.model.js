'use strict';
module.exports = (sequelize, DataTypes) => {
  const ScarpandRecover = sequelize.define("scarpandrecover", {
    materialInwardId: {
      type: DataTypes.INTEGER,
      references: {
          model: 'materialinwards', 
          key: 'id',
       }
    },
    comments:{
      type:DataTypes.STRING,
      allowNull:false
    },
    transactionType:{
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
      allowNull:false,
      unique: true
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

  ScarpandRecover.belongsTo(MaterialInward, {foreignKey: 'materialInwardId',onDelete: 'CASCADE'});

  return ScarpandRecover;
};