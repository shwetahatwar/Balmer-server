'use strict';
module.exports = (sequelize, DataTypes) => {
  const Depo = sequelize.define("depot", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    location:{
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
  return Depo;
};