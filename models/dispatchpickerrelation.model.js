'use strict';
module.exports = (sequelize, DataTypes) => {
  const DispatchPickerRelation = sequelize.define("dispatchpickerrelation", {
    dispatchId: {
      type: DataTypes.INTEGER,
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
  return DispatchPickerRelation;
};