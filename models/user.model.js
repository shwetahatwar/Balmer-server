'use strict';
var bcrypt = require('bcrypt-nodejs');
var bbPromise = require('bluebird');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status:{
      type:DataTypes.STRING,
      allowNull:true
    },
    role:{
      type:DataTypes.STRING,
      allowNull:false
    },
    employeeId:{
      type:DataTypes.STRING,
      allowNull:false
    },
    designation:{
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
  }, {
    hooks: {
      beforeUpdate: function(user) {
        return new bbPromise(function(resolve, reject) {
          bcrypt.genSalt(5, function(err, salt) {
            if (err) { reject(err); return; }

            bcrypt.hash(user.password, salt, null, function(err, hash) {
              if (err) { reject(err); return; }
              user.password = hash;
              resolve(user);
            });
          });
        });
      },
      beforeCreate: function(user) {
        return new bbPromise(function(resolve, reject) {
          bcrypt.genSalt(5, function(err, salt) {
            if (err) { reject(err); return; }

            bcrypt.hash(user.password, salt, null, function(err, hash) {
              if (err) { reject(err); return; }
              user.password = hash;
              resolve(user);
            });
          });
        });
      }
    },
    defaultScope: {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    },
    scopes: {
      withPassword: {
        attributes: { },
      }
    }
  });

  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  }

  return User;
};
