const responseHelper = require("../helpers/responseHelper");
const ArticleHelper = require("../helpers/articleHelper");
const { BestFilmCritic } = require("../models/BestFilmCritic");
const { Article } = require("../models/Article");

const ArticleController = {
  storeArticle: async (req, res) => {
    const { error } = ArticleHelper.storeValidate(req.body);
    if (error) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: error.details.map((err) => err.message.replace(/"/g, "")),
      });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      bestFilmCritic = await BestFilmCritic.findOne({
        where: { id: payload.best_film_critic_id, client_id: payload.user.id },
      });
      if (!bestFilmCritic) {
        return responseHelper(res, "noresult");
      }

      arrayToInsert = {
        client_id: payload.user.id ?? null,
        best_film_critic_id: payload.best_film_critic_id,
        article_type: payload.article_type,
        writer_name: payload.writer_name,
        article_title: payload.article_title,
        language_id: payload.language_id,
        other_language: payload.other_language ?? null,
        date_of_publication: payload.date_of_publication ?? null,
        name_of_publication: payload.name_of_publication ?? null,
        rni: payload.rni ?? null,
        publisher_furnished: payload.publisher_furnished ?? null,
        original_writing: payload.original_writing ?? null,
        website_link: payload.website_link ?? null,
        publisher_name: payload.publisher_name ?? null,
        publisher_email: payload.publisher_email ?? null,
        publisher_mobile: payload.publisher_mobile ?? null,
        publisher_landline: payload.publisher_landline ?? null,
        publisher_address: payload.publisher_address ?? null,
        publisher_citizenship: payload.publisher_citizenship ?? null,
      };

      article = await Article.create(arrayToInsert);

      if (!article) {
        return responseHelper(res, "noresult", {
          message: "Article not created.!!",
        });
      }

      return responseHelper(res, "created", {
        message: "Article addedd successfully.!!",
        data: article,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  updateArticle: async (req, res) => {
    const { error } = ArticleHelper.updateValidate(req.body);
    if (error) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: error.details.map((err) => err.message.replace(/"/g, "")),
      });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      article = await Article.findOne({
        where: {
          id: payload.id,
          best_film_critic_id: payload.best_film_critic_id,
        },
      });

      if (article) {
        if (
          payload.best_film_critic_id !== String(article.best_film_critic_id)
        ) {
          return responseHelper(res, "noresult", {
            message: "Can not modify best_film_critic_id.!!",
          });
        }

        bestFilmCritic = await BestFilmCritic.findOne({
          where: {
            id: payload.best_film_critic_id,
            client_id: payload.user.id,
          },
        });

        if (!bestFilmCritic) {
          return responseHelper(res, "noresult");
        }

        arrayToUpdate = {
          article_type: payload.article_type ?? article.article_type,
          writer_name: payload.writer_name ?? article.writer_name,
          article_title: payload.article_title ?? article.article_title,
          language_id: payload.language_id ?? article.language_id,
          other_language: payload.other_language ?? article.other_language,
          date_of_publication:
            payload.date_of_publication ?? article.date_of_publication,
          name_of_publication:
            payload.name_of_publication ?? article.name_of_publication,
          rni: payload.rni ?? article.rni,
          publisher_furnished:
            payload.publisher_furnished ?? article.publisher_furnished,
          original_writing:
            payload.original_writing ?? article.original_writing,
          website_link: payload.website_link ?? article.website_link,
          publisher_name: payload.publisher_name ?? article.publisher_name,
          publisher_email: payload.publisher_email ?? article.publisher_email,
          publisher_mobile:
            payload.publisher_mobile ?? article.publisher_mobile,
          publisher_landline:
            payload.publisher_landline ?? article.publisher_landline,
          publisher_address:
            payload.publisher_address ?? article.publisher_address,
          publisher_citizenship:
            payload.publisher_citizenship ?? article.publisher_citizenship,
        };

        articleUpdate = await article.update(arrayToUpdate);

        if (articleUpdate) {
          return responseHelper(res, "success", {
            message: "Article updated successfully.!!",
            data: articleUpdate,
          });
        } else {
          responseHelper(res, "updateError");
        }
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  listArticle: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };

      bestFilmCritic = BestFilmCritic.findOne({
        where: { id: payload.best_film_critic_id, client_id: payload.user.id },
      });

      if (!bestFilmCritic) {
        responseHelper(res, "noresult");
      }

      articleList = await Article.findAll({
        where: { best_film_critic_id: payload.best_film_critic_id },
      });

      if (articleList.length > 0) {
        if (articleList.length < 5) {
          return responseHelper(res, "noresult", {
            goNext: false,
            message: "At least 5 article must be submitted.!!",
            data: articleList,
          });
        }
        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: articleList,
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  getArticle: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      articleList = await Article.findOne({
        where: { id: payload.id },
      });
      if (articleList) {
        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: articleList,
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  deleteArticle: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      article = await Article.findOne({
        where: { id: payload.id },
      });
      if (article) {
        article.destroy();
        responseHelper(res, "success", {
          message: "Records deleted successfully.!!",
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },
};

module.exports = ArticleController;
