const { BestBookCinema } = require("../models/BestBookCinema");
const { BestFilmCritic } = require("../models/BestFilmCritic");
const { NfaNonFeature } = require("../models/NfaNonFeature");
const responseHelper = require("../helpers/responseHelper");
const PaymentSchema = require("../helpers/paymentSchema");
const { NfaFeature } = require("../models/NfaFeature");
const Constant = require("../libraries/Constant");
const { Payment } = require("../models/Payment");
const { Credential } = require("../models/Credential");

const PaymentController = {
  generateHash: async (req, res) => {
    const { isValid, errors } = PaymentSchema.validateData(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      const formType = Constant.formType()[payload.form_type];

      if (formType === 1) {
        applicationData = await NfaFeature.findOne({
          where: { id: payload.last_id, client_id: payload.user.id },
        });
        if (!applicationData) {
          return responseHelper(res, "exception", {
            message:
              "You are not an authorized user to payment. Please contact our support.!!",
          });
        }
      } else if (formType === 2) {
        applicationData = await NfaNonFeature.findOne({
          where: { id: payload.last_id, client_id: payload.user.id },
        });
        if (!applicationData) {
          return responseHelper(res, "exception", {
            message:
              "You are not an authorized user to payment. Please contact our support.!!",
          });
        }
      } else if (formType === 3) {
        applicationData = await BestBookCinema.findOne({
          where: { id: payload.last_id, client_id: payload.user.id },
        });
        if (!applicationData) {
          return responseHelper(res, "exception", {
            message:
              "You are not an authorized user to payment. Please contact our support.!!",
          });
        }
      } else if (formType === 4) {
        applicationData = await BestFilmCritic.findOne({
          where: { id: payload.last_id, client_id: payload.user.id },
        });
        if (!applicationData) {
          return responseHelper(res, "exception", {
            message:
              "You are not an authorized user to payment. Please contact our support.!!",
          });
        }
      }

      applicationData.form_type = payload.form_type;
      paymentResponse = Payment.paymentRequest(applicationData);

      // arrayToInsert = {
      //   client_id: applicationData.client_id,
      //   website_type: 5,
      //   form_type: payload.form_type ?? null,
      //   context_id: applicationData.id,
      // };

      // insertPayment = await Payment.create(arrayToInsert);
      // if (!insertPayment) {
      //   return responseHelper(res, "notvalid");
      // }

      // const credential = await Credential.findOne({
      //   where: { id: process.env.NFA },
      // });
      // if (!credential) {
      //   return responseHelper(res, "notvalid");
      // }

      console.log(paymentResponse);
      return "From Model";

      console.log(paymentResponse);
      return "From Controller";
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }

    // try {

    //         if ($paymentResponse['status']) {

    //             $data['payment_status'] =   2;

    //             if ($formType === 1) {
    //                 $application    =   NfaFeature::where('id', $payload['last_id'])->update($data);
    //             } else if ($formType === 2) {
    //                 $application    =   NfaNonFeature::where('id', $payload['last_id'])->update($data);
    //             } else if ($formType === 3) {
    //                 $application    =   BestBookCinema::where('id', $payload['last_id'])->update($data);
    //             } else if ($formType === 4) {
    //                 $application    =   BestFilmCritic::where('id', $payload['last_id'])->update($data);
    //             }

    //             if ($application) {
    //                 $response = [
    //                     'message'   => 'Payment Initiated Success.!!',
    //                     'data'      => [
    //                         'msg' => $paymentResponse['data']
    //                     ]
    //                 ];
    //                 return $this->response('success', $response);
    //             } else {
    //                 $response = [
    //                     'message' => 'Something went wrong!!',
    //                 ];
    //                 return $this->response('exception', $response);
    //             }
    //         } else {
    //             $response = [
    //                 'message'   =>  $paymentResponse['message'],
    //             ];
    //             return $this->response('exception', $response);
    //         }
    //     } else {
    //         $response = [
    //             'message'   =>  'Application not found in our record.!!',
    //         ];
    //         return $this->response('exception', $response);
    //     }
    // } catch (\Exception $e) {
    //     $response = [
    //         'message' => $e->getMessage(),
    //     ];
    //     return $this->response('exception', $response);
    // }
  },
};

module.exports = PaymentController;
