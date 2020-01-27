'use strict';
module.exports = (sequelize, DataTypes) => {
  const Depo = sequelize.define("depo", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location:{
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
  return Depo;
};