'use strict';
module.exports = (sequelize, DataTypes) => {
  const MaterialInward = sequelize.define("materialinward", {
    materialCode: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    
  });

  return MaterialInward;
};