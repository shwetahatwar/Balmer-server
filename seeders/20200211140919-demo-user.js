'use strict';
const Role = db.roles;
const Op = db.Sequelize.Op;
const User = db.users;

module.exports = {
  up: (queryInterface, Sequelize) => {
    const role = {
      name: "Admin",
      status:true,
      createdBy:1,
      updatedBy:1
    };

    var roleData;
    Role.create(role)
    .then(data => {
      // res.send(data);
      roleData = data[0]["dataValues"]["id"];
      const user = {
        username: "Nikhil",
        password: "briot",
        status: "1",
        role: roleData,
        employeeId:1004,
        designation:"Developer",
        createdBy:1,
        updatedBy:1
      };

      // Save User in the database
      User.create(user)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });

    })
    .catch(err => {
      // res.status(500).send({
      //   message:
      //     err.message || "Some error occurred while creating the role."
      // });
    });

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
