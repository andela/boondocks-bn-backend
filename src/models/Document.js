module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('document', {
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    travelAdminId: DataTypes.INTEGER,
    verified: DataTypes.BOOLEAN
  }, {});
  Document.associate = (models) => {
    Document.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'documentOwner',
    });
    Document.belongsTo(models.user, { foreignKey: 'travelAdminId', as: 'admin' });
  };
  return Document;
};
