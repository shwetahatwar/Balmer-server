'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispatchSlipMaterialList = sequelize.define("dispatchslipmateriallist", {
    dispatchSlipId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    batchNo:{
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
      type:DataTypes.INTEGER,
      allowNull:true
    },
    updatedBy:{
      type:DataTypes.INTEGER,
      allowNull:true
    }
    
  });

  DispatchSlipMaterialList.associate = function(models) {
    
    DispatchSlipMaterialList.belongsTo(models.DispatchSlip, {
      foreignKey: 'dispatchSlipId'
    });
  };
  return DispatchSlipMaterialList;
};