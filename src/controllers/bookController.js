const responseHelper = require("../helpers/responseHelper");
const { BestBookCinema } = require("../models/BestBookCinema");
const BookSchema = require("../helpers/bookSchema");
const { Book } = require("../models/Book");

const BookController = {
  storeBook: async (req, res) => {
    const { isValid, errors } = BookSchema.validateStore(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      bestBookCinema = await BestBookCinema.findOne({
        where: {
          id: payload.best_book_cinemas_id,
          client_id: payload.user.id,
        },
      });

      if (!bestBookCinema) {
        return responseHelper(res, "noresult");
      }

      arrayToInsert = {
        client_id: payload.user.id,
        best_book_cinemas_id: payload.best_book_cinemas_id ?? null,
        book_title_original: payload.book_title_original ?? null,
        book_title_english: payload.book_title_english,
        english_translation_book: payload.english_translation_book ?? null,
        receive_producer_award: payload.receive_producer_award ?? null,
        language_id: JSON.stringify(payload.language_id),
        author_name: payload.author_name,
        page_count: payload.page_count ?? null,
        date_of_publication: payload.date_of_publication,
        book_price: payload.book_price,
      };

      book = await Book.create(arrayToInsert);

      if (!book) {
        return responseHelper(res, "noresult", {
          message: "Book not created.!!",
        });
      }

      return responseHelper(res, "created", {
        message: "Book created successfully.!!",
        data: book,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  updateBook: async (req, res) => {
    const { isValid, errors } = BookSchema.validateUpdate(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      const book = await Book.findOne({
        where: {
          id: payload.id,
          client_id: payload.user.id,
        },
      });

      if (!book) {
        return responseHelper(res, "noresults");
      }

      bestBookCinema = await BestBookCinema.findOne({
        where: {
          id: payload.best_book_cinemas_id,
          client_id: payload.user.id,
        },
      });

      if (!bestBookCinema) {
        return responseHelper(res, "noresult");
      }

      const updatedData = {
        book_title_original:
          payload.book_title_original ?? book.book_title_original,
        book_title_english:
          payload.book_title_english ?? book.book_title_english,
        english_translation_book:
          payload.english_translation_book ?? book.english_translation_book,
        author_name: payload.author_name ?? book.author_name,
        page_count: payload.page_count ?? book.page_count,
        date_of_publication:
          payload.date_of_publication ?? book.date_of_publication,
        book_price: payload.book_price ?? book.book_price,
      };

      if (typeof payload.language_id === "object") {
        updatedData.language_id = JSON.stringify(payload.language_id);
      }

      await book.update(updatedData);
      return responseHelper(res, "success", { data: book });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  listBook: async (req, res) => {
    const { isValid, errors } = BookSchema.validateList(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      let allBook;

      if (payload.best_book_cinemas_id != null) {
        bestBookCinema = await BestBookCinema.findOne({
          where: {
            id: payload.best_book_cinemas_id,
            client_id: payload.user.id,
          },
        });

        if (!bestBookCinema) {
          return responseHelper(res, "noresult");
        }

        allBook = await Book.findAll({
          where: {
            best_book_cinemas_id: payload.best_book_cinemas_id,
            client_id: payload.user.id,
          },
        });
      }
      const books = allBook.map((book) => ({
        id: book.id,
        client_id: book.client_id,
        best_book_cinemas_id: book.best_book_cinemas_id,
        book_title_original: book.book_title_original,
        book_title_english: book.book_title_english,
        english_translation_book: book.english_translation_book,
        author_name: book.author_name,
        page_count: book.page_count,
        date_of_publication: book.date_of_publication,
        book_price: book.book_price,
        language_id: book.language_id,
      }));
      responseHelper(res, "success", { data: books });
    } catch (error) {
      responseHelper(res, "exception", { message: error });
    }
  },

  getBook: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      const book = await Book.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });
      if (!book) {
        return responseHelper(res, "noresult");
      }

      const bookById = {
        id: book.id,
        client_id: book.client_id,
        best_book_cinemas_id: book.best_book_cinemas_id,
        book_title_original: book.book_title_original,
        book_title_english: book.book_title_english,
        english_translation_book: book.english_translation_book,
        author_name: book.author_name,
        page_count: book.page_count,
        date_of_publication: book.date_of_publication,
        book_price: book.book_price,
        language_id: book.language_id,
      };
      if (book) {
        responseHelper(res, "success", { data: bookById });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      const book = await Book.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });
      if (book) {
        await book.destroy();
        responseHelper(res, "success");
      } else {
        responseHelper(res, "noresult");
      }
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },
};
module.exports = BookController;
