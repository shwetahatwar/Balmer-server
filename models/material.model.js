'use strict';
module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define("material", {
    materialType: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    materialCode: {
      type: DataTypes.STRING,
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
      type: DataTypes.INTEGER,
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
    
  }),

  MaterialType = sequelize.define("materialtype", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    
  }),
  
  PackagingType = sequelize.define("packagingtype", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
  Material.belongsTo(MaterialType, {foreignKey: 'materialType',onDelete: 'CASCADE'});
  Material.belongsTo(PackagingType, {foreignKey: 'packingType',onDelete: 'CASCADE'})
  return Material;
};