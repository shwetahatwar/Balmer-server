'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectAuditItems = sequelize.define("projectaudititems", {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    materialCode:{
      type:DataTypes.STRING,
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
  return ProjectAuditItems;
};