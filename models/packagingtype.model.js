'use strict';
module.exports = (sequelize, DataTypes) => {
  const PackagingType = sequelize.define("packagingtype", {
    name: {
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
  return PackagingType;
};