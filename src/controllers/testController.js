const testing = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "Testing success!!",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = { testing };
