'use strict';
const {conf} = require('../config/app_config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable(conf.cookie.ses_table_name, {
            user_id: {
                allowNull: false,
                type: Sequelize.BIGINT
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            token: {
                type: Sequelize.TEXT,
                allowNull: false,
                // allowNull defaults to true
            },
            refresh: {
                allowNull: true,
                type: Sequelize.DATE
            },
            created_at: {
                allowNull: true,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable(conf.cookie.ses_table_name);
    }
};