'use strict';
module.exports = (sequelize, DataTypes) => {
  const MaterialInward = sequelize.define("materialinward", {
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
      allowNull:false,
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
    
  }),

  Material = sequelize.define("material", {
    materialType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    materialCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    materialDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genericName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    packingType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    packSize: {
      type: DataTypes.STRING,
      allowNull: false
    },
    netWeight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    grossWeight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tareWeight: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    UOM: {
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

  MaterialInward.belongsTo(Material, {foreignKey: 'materialId',onDelete: 'CASCADE'})

  return MaterialInward;
};