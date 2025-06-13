const { DataTypes } = require("sequelize");
const Constant = require("../libraries/Constant");
const { Credential } = require("./Credential");
const sequelize = require(".");
// const dotenv = require("dotenv");
// dotenv.config();

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    website_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    form_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    context_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    request_payload: {
      type: DataTypes.TEXT,
      allowNull: true,
      //   validate: { notEmpty: true },
    },

    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      //   unique: true,
      //   validate: { isEmail: true, notEmpty: true },
    },

    payment_date: {
      type: DataTypes.DATE,
      allowNull: true,
      //   unique: true,
      //   validate: { isNumeric: true, len: [10, 10] },
    },

    bank_ref_no: {
      type: DataTypes.STRING,
      allowNull: true,
      //   validate: { notEmpty: true },
    },

    payment_method_type: {
      type: DataTypes.STRING(),
      allowNull: true,
      // validate: { isNumeric: true, len: [6, 6] },
    },

    currency: {
      type: DataTypes.STRING(),
      allowNull: true,
      // validate: { isNumeric: true, len: [6, 6] },
    },

    bank_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // validate: { isNumeric: true, len: [6, 6] },
    },

    bank_merchant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // validate: { isNumeric: true, len: [6, 6] },
    },

    item_code: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: { isNumeric: true, len: [6, 6] },
    },

    security_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    security_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    security_password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    auth_status: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    settlement_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    error_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    transaction_error_desc: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    // created_at: { type: DataTypes.TIME },
    // updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "payments",
  }
);

const paymentRequest = async (requestData) => {
  arrayToInsert = {
    client_id: requestData.client_id,
    website_type: 5,
    form_type: Constant.formType()[requestData.form_type] ?? null,
    context_id: requestData.id,
  };

  insertPayment = await Payment.create(arrayToInsert);
  if (!insertPayment) {
    throw new Error("Something went wrong.!!");
  }

  //   const credential = await Credential.findOne({
  //     where: { id: process.env.NFA },
  //   });

  //   if (!credential) {
  //     throw new Error("Credential not found.!!");
  //   }

  credential = await Credential.getCredential(2);

  console.log(credential);
  return "From Model";

  if (requestData.form_type === "FEATURE") {
    $amount = env("NFA_FEATURED_AMOUNT")
      ? env("NFA_FEATURED_AMOUNT")
      : $credential["NFA_FEATURED_AMOUNT"];
  }

  console.log(credential);
  return "From Model";

  //                     if (isset($request['form_type']) && $request['form_type'] === 'FEATURE') {
  //                         $amount = env('NFA_FEATURED_AMOUNT') ? env('NFA_FEATURED_AMOUNT') : $credential['NFA_FEATURED_AMOUNT'];
  //                     }

  //                     if (isset($request['form_type']) && $request['form_type'] === 'NON-FEATURE') {
  //                         $amount = env('NFA_NON_FEATURED_AMOUNT') ? env('NFA_NON_FEATURED_AMOUNT') : $credential['NFA_NON_FEATURED_AMOUNT'];
  //                     }

  //                     if (isset($request['form_type']) && $request['form_type'] === 'BEST-BOOK') {
  //                         $amount = env('NFA_BEST_BOOK_AMOUNT') ? env('NFA_BEST_BOOK_AMOUNT') : $credential['NFA_BEST_BOOK_AMOUNT'];
  //                     }

  //                     if (isset($request['form_type']) && $request['form_type'] === 'BEST-FILM-CRITIC') {
  //                         $amount = env('NFA_BEST_FILM_CRITIC_AMOUNT') ? env('NFA_BEST_FILM_CRITIC_AMOUNT') : $credential['NFA_BEST_FILM_CRITIC_AMOUNT'];
  //                     }

  //                     if (!is_numeric($amount)) {
  //                         $response = [
  //                             'message'   =>  'Please enter valid amount.!!',
  //                         ];
  //                         return $this->response('exception', $response);
  //                     }

  //                     $formType = array_flip(CONSTANT::formType());

  //                     $requestPayload =   [
  //                         'MERCHANT_ID'       =>  $credential['MERCHANT_ID'],
  //                         'CUSTOMER_ID'       =>  $request['client_id'] . $request['id'],
  //                         'SECURITY_ID'       =>  $credential['SECURITY_ID'],
  //                         'COMMON_KEY'        =>  $credential['COMMON_KEY'],
  //                         'AMOUNT'            =>  $amount,
  //                         'ORDER_ID'          =>  $insertInPayment->id,
  //                         'CURRENCY_TYPE'     =>  $credential['CURRENCY_TYPE'],
  //                         'EMAIL'             =>  $client['email'],
  //                         'MOBILE'            =>  $client['mobile'],
  //                         'NFAI'              =>  $formType[$data['form_type']],
  //                         'FIRST_NAME'        =>  $client['first_name'],
  //                         'LAST_NAME'         =>  $client['last_name'],
  //                         'REQUEST_ID'        =>  $request['id'],
  //                     ];

  //                     $response = LibrariesPayment::proceedToPay($requestPayload);

  //                     if ($response['status']) {

  //                         $dataForDb  =   [
  //                             'request_payload'   =>  $response['data'],
  //                             'amount'            =>  $amount,
  //                             'status'            =>  2
  //                         ];

  //                         $saveIntoDb =   Payment::where('id', $insertInPayment->id)->update($dataForDb);

  //                         if ($saveIntoDb) {
  //                             return [
  //                                 'status'    =>  true,
  //                                 'data'      =>  $response['data']
  //                             ];
  //                         } else {
  //                             return [
  //                                 'status'    =>  false,
  //                                 'message'   =>  'Soemthing went wrong.! Please retry after sometime.!',
  //                             ];
  //                         }
  //                     } else {
  //                         return [
  //                             'status'    =>  false,
  //                             'message'   =>  $response['message'],
  //                         ];
  //                     }
  //                 } else {
  //                     return [
  //                         'status'    =>  false,
  //                         'message'   =>  'Credential Not Found.!!',
  //                     ];
  //                 }
  //             } else {
  //                 return [
  //                     'status'    =>  false,
  //                     'message'   =>  'Client not found.!!',
  //                 ];
  //             }
  //         } else {
  //             return [
  //                 'status'    =>  false,
  //                 'message'   =>  'Payment insertion failed.!!',
  //             ];
  //         }
};
Payment.paymentRequest = paymentRequest;
module.exports = { Payment };
