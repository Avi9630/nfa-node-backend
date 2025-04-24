const responseHelper = (res, input = "", params = {}) => {
  const statusResp = {
    success: { statusCode: 200, status: true, message: "Success!" },
    noresult: { statusCode: 200, status: false, message: "No Record Found!" },
    exception: { statusCode: 500, status: false, message: "Exception Error!" },
    incorrectinfo: {
      statusCode: 200,
      status: false,
      message: "The provided information is incorrect!",
    },
    updateError: {
      statusCode: 200,
      status: false,
      message: "Error while Updating!",
    },
    notvalid: {
      statusCode: 200,
      status: false,
      message: "The provided information is not Valid!",
    },
    apierror: {
      statusCode: 408,
      status: false,
      message: "API is not responding right now!",
    },
    validatorerrors: {
      statusCode: 200,
      status: false,
      message: "Validation Error!",
    },
    bearertoenerror: {
      statusCode: 401,
      status: false,
      message: "Invalid credential. Please login first.",
    },
    basictoenerror: {
      statusCode: 401,
      status: false,
      message:
        "Invalid credential. Please Retry with correct username and API key.",
    },
    tokenexp: {
      statusCode: 401,
      status: false,
      message:
        "Invalid Token. Please Create a New Token and Use within 30 min.",
    },
    completed: {
      statusCode: 200,
      status: true,
      message: "You Are Successfully Verified All Steps.",
    },
    unauthorized: {
      statusCode: 401,
      status: false,
      message: "Unauthorized Access!",
    },
    created: {
      statusCode: 201,
      status: true,
      message: "Created Successfully!",
    },
    unprocessableEntity: {
      statusCode: 422,
      status: true,
      message: "Unprocessable Entity!",
    },
    badrequest: {
      statusCode: 422,
      status: true,
      message: "Bad request.!!",
    },
  };

  if (statusResp[input]) {
    const { statusCode, ...data } = statusResp[input];
    return res.status(statusCode).json({ ...data, ...params });
  } else {
    return res.json(params);
  }
};

module.exports = responseHelper;
