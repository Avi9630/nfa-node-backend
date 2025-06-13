const { DataTypes } = require("sequelize");
const sequelize = require(".");

const decryptLaravel = require("../helpers/laravelCrypt");

const Credential = sequelize.define(
  "Credential",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // created_at: { type: DataTypes.TIME },
    // updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "credentials",
  }
);

const getCredential = async (id) => {
  // credential = await Credential.findOne({
  //   where: { id: id },
  //   attributes: ["created_at", "updated_at", "data"],
  // });
  const credential = await Credential.findOne({
    attributes: ["created_at", "updated_at", "data"],
    where: { id },
    raw: true,
  });

  if (!credential) {
    throw new Error("Credential not found");
  } else {
    const decoded = JSON.parse(credential.data); // { body: '...' }
    const decryptedBody = decryptLaravel(decoded.body); // returns plain‑text JSON

    // return {
    //   ...JSON.parse(decryptedBody),
    //   created_at: credential.created_at,
    //   updated_at: credential.updated_at,
    // };
    console.log(decoded);
    return "From Credential.!!!!";
  }
};

// public function getCredential($id)
//     {
//         $credential = Credential::select('created_at', 'updated_at', 'data')
//             ->where('id', $id)
//             ->first()
//             ->toArray();

//         if (!empty($credential)) {
//             $decodeData =   json_decode($credential['data'], true);
//             $decodeData =   Crypt::decrypt($decodeData['body']);
//             $decodeData['created_at']   =  $credential['created_at'];
//             $decodeData['updated_at']   =  $credential['updated_at'];
//             return   $decodeData;
//         } else {
//             $res = [
//                 'message' => 'Credentials not found!!'
//             ];
//             return $this->response('exception', $res);
//         }
//     }

Credential.getCredential = getCredential;
module.exports = { Credential };
