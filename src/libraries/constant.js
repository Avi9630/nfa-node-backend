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

  formType: () => {
    return {
      FEATURE: 1,
      NON_FEATURE: 2,
      BEST_BOOK: 3,
      BEST_FILM_CRITIC: 4,
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

  stepsFeature: () => {
    return {
      GENRAL: 1,
      CENSOR: 2,
      COMPANY_REGISTRATION: 3,
      PRODUCER: 4,
      DIRECTOR: 5,
      ACTORS: 6,
      SONGS: 7,
      AUDIOGRAPHER: 8,
      OTHER: 9,
      RETURN_ADDRESS: 10,
      DECLARATION: 11,
      FINAL_SUBMIT: 12,
    };
  },

  stepsNonFeature: () => {
    return {
      GENRAL: 1,
      CENSOR: 2,
      COMPANY_REGISTRATION: 3,
      PRODUCER: 4,
      DIRECTOR: 5,
      OTHER: 6,
      RETURN_ADDRESS: 7,
      DECLARATION: 8,
      FINAL_SUBMIT: 9,
    };
  },

  stepsBestBook: () => {
    return {
      BEST_BOOK_ON_CINEMA: 1,
      AUTHOR: 2,
      PUBLISHER_EDITOR: 3,
      DECLARATION: 4,
      FINAL_SUBMIT: 5,
    };
  },

  stepsBestFilmCritic: () => {
    return {
      BEST_FILM_CRITIC: 1,
      CRITIC: 2,
      PUBLISHER: 3,
      DECLARATION: 4,
      FINAL_SUBMIT: 5,
    };
  },
};

module.exports = Constant;
