module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('users', 'twoFAType', {
      type: Sequelize.ENUM,
      allowNull: false,
      defaultValue: 'none',
      values: [
        'none',
        'sms_text',
        'sms_text_temp',
        'authenticator_app',
        'authenticator_app_temp',
      ],
    }),
    queryInterface.addColumn('users', 'twoFASecret', {
      type: Sequelize.STRING,
      allowNull: true,
    }),
    queryInterface.addColumn('users', 'twoFADataURL', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    }),
  ]),
  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('users', 'twoFAType'),
    queryInterface.removeColumn('users', 'twoFASecret'),
    queryInterface.removeColumn('users', 'twoFADataURL'),
  ]),
};
