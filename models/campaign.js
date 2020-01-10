module.exports = function(sequelize, DataTypes) {
  const Campaign = sequelize.define("Campaign", {
    // The email cannot be null, and must be a proper email before creation
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    // The password cannot be null
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    characters: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Campaign.associate = function(models) {
    models.Campaign.hasMany(models.Characters);
  };
  
  return Campaign;
};
