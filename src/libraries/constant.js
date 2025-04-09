// const generateToken = async (length) => {
//   const chars =
//     "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   const repeatedChars = chars.repeat(Math.ceil(length / chars.length));
//   const shuffled = repeatedChars
//     .split("")
//     .sort(() => 0.5 - Math.random())
//     .join("");
//   return shuffled.substring(0, length);
// };

const Constant = {
  websiteType: () => {
    return {
      IP: 1,
      OTT: 2,
      CMOT: 3,
      DD: 4,
      NFA: 5,
    };
  },

  userType: () => {
    return {
      1: "Producer/Production Company",
      2: "Publisher",
    };
  },

  generateToken: async (length) => {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const repeatedChars = chars.repeat(Math.ceil(length / chars.length));
    const shuffled = repeatedChars
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
    return shuffled.substring(0, length);
  },
};

module.exports = Constant;
