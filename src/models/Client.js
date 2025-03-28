const { DataTypes } = require("sequelize");
const sequelize = require("../models");

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    usertype: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: {
      //   isEmail: true,
      //   notEmpty: true,
      // },
    },

    mobile: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 10],
      },
    },

    pincode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [6, 6],
      },
    },

    aadhar_number: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [12, 12],
      },
    },

    landline: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255], // Minimum password length
      },
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    activate_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "clients",
    hooks: {
      beforeCreate: (client) => {
        client.password = bcrypt.hashSync(client.password, 10);
      },
    },
  }
);

module.exports = Client;
