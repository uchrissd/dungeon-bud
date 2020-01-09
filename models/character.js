module.exports = function(sequelize, DataTypes) {
  const Character = sequelize.define("Character", {
    // The email cannot be null, and must be a proper email before creation
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    // The password cannot be null
    race: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    class: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },

    bio: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  return Character;
};