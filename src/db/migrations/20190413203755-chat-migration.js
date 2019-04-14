'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('chat_rooms', 'chat_room_serial_id', 'chat_room_id'),
      queryInterface.changeColumn('chat_rooms', 'room_id', Sequelize.INTEGER),
      queryInterface.addColumn('chat_rooms', 'title', Sequelize.STRING),
      queryInterface.addColumn('chat_rooms', 'created', Sequelize.TIME),
      queryInterface.addColumn('chat_rooms', 'created_by', Sequelize.INTEGER),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
