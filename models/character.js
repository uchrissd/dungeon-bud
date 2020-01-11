module.exports = function (sequelize, Sequelize) {
  const Character = sequelize.define("Character", {
    // The email cannot be null, and must be a proper email before creation
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    // The password cannot be null
    race: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    class: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },

    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },

    bio: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  });

  Character.associate = function (models) {
    Character.belongsTo(models.Campaign, {
      foreignKey: {
        allowNull: false
      }
    });
    Character.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Character;
};
