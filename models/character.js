module.exports = function (sequelize, Sequelize) {
  const Character = sequelize.define("Character", {
    // The email cannot be null, and must be a proper email before creation
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // The password cannot be null
    race: {
      type: Sequelize.STRING,
      allowNull: false
    },

    class: {
      type: Sequelize.STRING,
      allowNull: false
    },

    level: {
      type: Sequelize.INTEGER,
      allowNull: false
    },

    bio: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  Character.associate = function(models){
    Character.belongsTo(models.User);
  };
  return Character;
};
