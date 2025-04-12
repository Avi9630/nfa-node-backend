const testing = async (req, res) => {
  try {
    res.status(200).send({
      status: true,
      message: "Testing success!!",
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = { testing };
