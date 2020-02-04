'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectAuditItems = sequelize.define('projectaudititems', {
    projectId: {
      type: DataTypes.INTEGER,
      references: {
          model: 'projects', 
          key: 'id',
       }
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
  }, {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
    scopes: {
      withAllColumns: {
        attributes: { },
      }
    }
  }),

  Project = sequelize.define("project", {
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

  ProjectAuditItems.belongsTo(Project, {foreignKey: 'projectId',onDelete: 'CASCADE'})

  return ProjectAuditItems;
};