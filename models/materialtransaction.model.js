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
		truckId:{
			type:DataTypes.INTEGER
		},
		depoId:{
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
		},
		createdBy:{
			type:DataTypes.STRING,
			allowNull:true
		},
		updatedBy:{
			type:DataTypes.STRING,
			allowNull:true
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
	}),

	Ttat = sequelize.define("ttat", {
		truckNumber: {
			type: DataTypes.STRING,
			allowNull: false
		},
		capacity: {
			type: DataTypes.STRING,
			allowNull: false
		},
		inTime: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		outTime: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		driver: {
			type: DataTypes.STRING,
			allowNull: false
		},
		loadStartTime: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		loadEndTime: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		loadingTime: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		inOutTime: {
			type: DataTypes.BIGINT,
			allowNull: true
		},
		idleTime:{
			type:DataTypes.BIGINT,
			allowNull:true
		},
		driverMobileNumber:{
			type:DataTypes.STRING,
			allowNull:true
		},
		transportor:{
			type:DataTypes.STRING,
			allowNull:true
		},
		outRemarks:{
			type:DataTypes.STRING,
			allowNull:true
		},
		createdBy:{
			type:DataTypes.STRING,
			allowNull:true
		},
		updatedBy:{
			type:DataTypes.STRING,
			allowNull:true
		}
		
	}),

	Depot = sequelize.define("depot", {
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

	MaterialTransaction.belongsTo(Ttat, {foreignKey: 'truckId',onDelete: 'CASCADE'});
	MaterialTransaction.belongsTo(Depot, {foreignKey: 'depoId',onDelete: 'CASCADE'})
	MaterialTransaction.belongsTo(DispatchSlip, {foreignKey: 'dispatchId',onDelete: 'CASCADE'})
	return MaterialTransaction;
};