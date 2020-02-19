'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("project", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    auditors:{
      type: DataTypes.STRING,
      allowNull: false
    },
    start:{
      type:DataTypes.DATE,
      allowNull:true
    },
    end:{
      type:DataTypes.DATE,
      allowNull:true
    },
    status:{
      type:DataTypes.BOOLEAN,
      allowNull:false
    },
    projectStatus:{
      type:DataTypes.STRING,
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