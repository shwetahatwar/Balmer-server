'use strict';
module.exports = (sequelize, DataTypes) => {
	const MaterialTransaction = sequelize.define("materialtransaction", {
		serialNumber:{
			type:DataTypes.STRING,
			allowNull:false,
			unique: true
		},
		inwardedOn: {
			type: DataTypes.STRING
		},
		inwardedBy: {
			type: DataTypes.STRING
		},
		scrappedOn: {
			type: DataTypes.STRING
		},
		scrappedBy: {
			type: DataTypes.STRING
		},
		recoveredOn: {
			type: DataTypes.STRING
		},
		recoveredBy: {
			type: DataTypes.STRING
		},
		dispatchId:{
			type:DataTypes.INTEGER
		},
		pickedOn: {
			type: DataTypes.STRING
		},
		pickedBy: {
			type: DataTypes.STRING
		},
		materialGenericName:{
			type: DataTypes.STRING,
			allowNull: false
		},
		materialDescription:{
			type: DataTypes.STRING,
			allowNull: false
		},
		loadedOn: {
			type: DataTypes.STRING
		},
		loadedBy: {
			type: DataTypes.STRING,
		}
	}),

	DispatchSlip = sequelize.define("dispatchslip", {
    dispatchSlipNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    truckId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    depoId:{
      type:DataTypes.INTEGER,
      allowNull:false
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

  MaterialTransaction.belongsTo(DispatchSlip, {foreignKey: 'dispatchId',onDelete: 'CASCADE'})
	return MaterialTransaction;
};