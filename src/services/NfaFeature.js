const LibrariesNFAFeature = require("../services/LibrariesNFAFeature");

function validateData(payload) {
  const validatorArray = [
    body("step")
      .exists()
      .withMessage("Step is required")
      .isNumeric()
      .withMessage("Step must be numeric"),
  ];

  console.log(validatorArray);
  return "From Services";

  const messagesArray = {};
  const step = payload.step;

  if (step && step !== CONSTANT.stepsFeature().GENRAL) {
    validatorArray.push(
      body("last_id").exists().withMessage("last_id is required")
    );
  }

  const stepMethods = {
    [CONSTANT.stepsFeature().GENRAL]: "GENRAL",
    [CONSTANT.stepsFeature().CENSOR]: "CENSOR",
    [CONSTANT.stepsFeature().COMPANY_REGISTRATION]: "COMPANYREGISTRATION",
    [CONSTANT.stepsFeature().PRODUCER]: "PRODUCER",
    [CONSTANT.stepsFeature().DIRECTOR]: "DIRECTOR",
    [CONSTANT.stepsFeature().ACTORS]: "ACTORS",
    [CONSTANT.stepsFeature().SONGS]: "SONGS",
    [CONSTANT.stepsFeature().AUDIOGRAPHER]: "AUDIOGRAPHER",
    [CONSTANT.stepsFeature().OTHER]: "OTHER",
    [CONSTANT.stepsFeature().RETURN_ADDRESS]: "RETURNADDRESS",
    [CONSTANT.stepsFeature().DECLARATION]: "DECLARATION",
  };

  if (step && stepMethods[step]) {
    const validationResult = LibrariesNFAFeature[stepMethods[step]](payload);
    if (validationResult.validatorArray) {
      validatorArray.push(...validationResult.validatorArray);
    }
  }

  return {
    validatorArray,
    messagesArray,
  };
}

module.exports = { validateData };
