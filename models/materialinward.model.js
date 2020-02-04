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
    dispatchSlipId:{
      type:DataTypes.INTEGER,
      allowNull:true
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

  Material = sequelize.define("material", {
    materialType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    materialCode: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      type: DataTypes.STRING,
      allowNull: false
    },
    grossWeight: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tareWeight: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UOM: {
      type: DataTypes.STRING,
      allowNull: false
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

  MaterialInward.belongsTo(Material, {foreignKey: 'materialId',onDelete: 'CASCADE'})

  return MaterialInward;
};