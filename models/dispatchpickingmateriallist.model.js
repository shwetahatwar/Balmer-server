'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispatchPickingMaterialList = sequelize.define("dispatchpickingmateriallist", {
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
      type:DataTypes.INTEGER,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.INTEGER,
      allowNull:true
    }
    
  });
  return DispatchPickingMaterialList;
};