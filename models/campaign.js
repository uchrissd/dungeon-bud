module.exports = function (sequelize, Sequelize) {
  const Campaign = sequelize.define("Campaign", {
    // The email cannot be null, and must be a proper email before creation
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    // The password cannot be null
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: Sequelize.STRING,
      allowNull: true
    },
    characters: {
      type: Sequelize.STRING,
      allowNull: true
    }
  });
  Campaign.associate = function (models) {
    Campaign.belongsTo(models.User);
  };
  return Campaign;
};
