const { DataTypes } = require("sequelize");
const sequelize = require("../models");
// const bcrypt = require("bcryptjs");
const bcrypt = require("bcrypt");

// const Client = sequelize.define(
//   "Client",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },

//     usertype: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     website_type: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },

//     first_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },

//     last_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },

//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         isEmail: true,
//         notEmpty: true,
//       },
//     },

//     mobile: {
//       type: DataTypes.STRING(10),
//       allowNull: false,
//       unique: true,
//       validate: {
//         isNumeric: true,
//         len: [10, 10],
//       },
//     },

//     pincode: {
//       type: DataTypes.STRING(6),
//       allowNull: false,
//       validate: {
//         isNumeric: true,
//         len: [6, 6],
//       },
//     },

//     aadhar_number: {
//       type: DataTypes.STRING(12),
//       allowNull: false,
//       unique: true,
//       validate: {
//         isNumeric: true,
//         len: [12, 12],
//       },
//     },

//     landline: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },

//     address: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//       },
//     },

//     username: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       unique: true,
//       validate: {
//         notEmpty: true,
//       },
//     },

//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         notEmpty: true,
//         len: [6, 255], // Minimum password length
//       },
//     },

//     active: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     activate_token: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     timestamps: false,
//     tableName: "clients",
//     hooks: {
//       beforeCreate: (client) => {
//         client.password = bcrypt.hashSync(client.password, 8);
//       },
//     },
//   }
// );

// const generateUsername = async (usertype) => {
//   const latestUser = await Client.findOne({
//     where: { usertype },
//     order: [["id", "DESC"]],
//     attributes: ["username"],
//   });

//   // 2. Default base prefix based on usertype
//   let prefix = "";
//   if (usertype === "1") {
//     prefix = "PRO000";
//   } else if (usertype === "2") {
//     prefix = "PUB000";
//   } else {
//     prefix = "OTR000";
//   }

//   // 3. Generate new username
//   if (!latestUser || !latestUser.username) {
//     return `${prefix}1`;
//   } else {
//     // Extract number from existing username
//     const numPart = parseInt(latestUser.username.replace(prefix, "")) || 0;
//     const newNumber = numPart + 1;
//     return `${prefix}${newNumber}`;
//   }
// };

// Function to generate a new username based on user type

// Define Client model with structured validation
const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true },
    },
    mobile: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: { isNumeric: true, len: [10, 10] },
    },
    pincode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: { isNumeric: true, len: [6, 6] },
    },
    aadhar_number: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
      validate: { isNumeric: true, len: [12, 12] },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { notEmpty: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [6, 255] }, // Ensuring a strong password length
    },
    landline: { type: DataTypes.STRING, allowNull: true },
    usertype: { type: DataTypes.INTEGER, allowNull: false },
    website_type: { type: DataTypes.INTEGER, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: false },
    activated_date: { type: DataTypes.DATE, allowNull: true },
    activate_token: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
    tableName: "clients",
    hooks: {
      beforeCreate: (client) => {
        client.password = bcrypt.hashSync(client.password, 8);
      },
    },
  }
);

const generateUsername = async (usertype) => {
  const prefixes = { 1: "PRO000", 2: "PUB000", default: "OTR000" };
  const prefix = prefixes[usertype] || prefixes.default;

  const latestUser = await Client.findOne({
    where: { usertype },
    order: [["id", "DESC"]],
    attributes: ["username"],
  });

  const numPart = latestUser?.username
    ? parseInt(latestUser.username.replace(prefix, "")) || 0
    : 0;
  return `${prefix}${numPart + 1}`;
};

const fiendByCredential = async (clientEmail, clientPassword) => {
  const client = await Client.findOne({ where: { email: clientEmail } });

  if (!client) {
    throw new Error("Unable to get records.!!");
  }

  // if (!client.active) {
  //   throw new Error(
  //     "Account not activated. Please activate your account first!!"
  //   );
  //   // return res.status(400).json({ message: "Account not activated" });
  // }

  const isMatch = await bcrypt.compare(clientPassword, client.password);
  // const isMatch = await bcrypt.compare(
  //   "$2b$08$mMGWpdzv3lBWquyqUJuv4Oc96mhcPi9WW6h6e7nhMLn6sGjcPwOMq",
  //   client.password
  // );
  console.log("Password match result:", isMatch);

  if (!isMatch) {
    throw new Error("Unable to login.!!");
  }
  return client;
};

Client.fiendByCredential = fiendByCredential;
Client.generateUsername = generateUsername;
module.exports = { Client, generateUsername };
