'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("project", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    auditors:{
      type: DataTypes.STRING,
      allowNull: false
    },
    start:{
      type:DataTypes.STRING,
      allowNull:true
    },
    end:{
      type:DataTypes.STRING,
      allowNull:true
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
  return Project;
};