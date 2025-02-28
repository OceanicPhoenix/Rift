'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ServerMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      server_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Servers',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });

    // Add unique constraint on server_id and user_id
    await queryInterface.addIndex('ServerMembers', ['server_id', 'user_id'], {
      unique: true,
      name: 'server_members_server_id_user_id_unique'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ServerMembers');
  }
};