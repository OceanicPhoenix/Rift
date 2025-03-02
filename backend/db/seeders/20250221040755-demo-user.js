'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");
const { faker } = require('@faker-js/faker');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [
      // Demo user - easy access with consistent credentials
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Demo',
        lastName: 'User',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo-lition',
        status: 'online',
        created_at: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Generate 20 additional fake users
    for (let i = 0; i < 20; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet.username({ firstName, lastName });
      
      users.push({
        email: faker.internet.email({ firstName, lastName }),
        username,
        hashedPassword: bcrypt.hashSync('password'),
        firstName,
        lastName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        status: faker.helpers.arrayElement(['online', 'idle', 'do not disturb', 'invisible', 'offline']),
        created_at: faker.date.past(),
        updatedAt: faker.date.recent()
      });
    }
    
    try {
      await User.bulkCreate(users, { validate: true });
      console.log('Successfully created users');
    } catch (error) {
      console.error('Error creating users:', error.message);
      throw error; // Re-throw to stop the seeding process
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkDelete(options, {}, {});
  }
};