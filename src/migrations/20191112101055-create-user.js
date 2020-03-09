module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'password',
    },
    isVerified: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    lastLogin: {
      allowNull: true,
      type: Sequelize.DATE
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    birthDate: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    residenceAddress: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    lineManagerId: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    preferredLanguage: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    preferredCurrency: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    department: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    gender: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    phoneNumber: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.ENUM,
      allowNull: false,
      defaultValue: 'requester',
      values: [
        'super_administrator',
        'travel_administrator',
        'suppliers',
        'travel_team_member',
        'manager',
        'requester'
      ]
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('users')
};
