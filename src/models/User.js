module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isVerified: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    birthDate: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    residenceAddress: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    lineManagerId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    preferredLanguage: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    preferredCurrency: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    department: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    gender: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: 'password'
    },
    lastLogin: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'requester',
      values: [
        'super_administrator',
        'travel_administrator',
        'travel_team_member',
        'manager',
        'requester'
      ]
    },
    phoneNumber: {
      allowNull: true,
      type: DataTypes.STRING
    },
    receiveNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {});
  User.associate = (models) => {
    User.hasMany(models.booking, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.hotel, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.user, {
      foreignKey: 'lineManagerId',
      onDelete: 'CASCADE'
    });
    User.belongsTo(models.user, {
      foreignKey: 'lineManagerId',
      as: 'LineManager',
    });
    User.hasMany(models.request, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.comment, {
      foreignKey: 'userId',
    });
    User.hasMany(models.notification, {
      foreignkey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
