const path = require("path");
const fs = require("fs");
const CONSTANT = require("../libraries/Constant");
const { Document } = require("../models/Document");

// const { uploadDocument } = require("../services/documentService"); // Assuming a service method

const ImageLib = {
  imageUpload: async (data) => {
    try {
      const websiteType = CONSTANT.websiteType()[data.websiteType] || null;
      const formType = CONSTANT.formType()[data.formType] || null;
      if (!websiteType || !formType) {
        return false;
      }

      const image = data.image; // Should be a Multer file object
      const originalName = image.originalname;
      const fileName = path.parse(originalName).name;
      const extension = path.extname(originalName);
      const modifiedName = `${fileName}_${Date.now()}${extension}`;
      const directory = path.join(
        __dirname,
        "..",
        "public/documents",
        data.websiteType
      );

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      const filePath = path.join(directory, modifiedName);
      fs.writeFileSync(filePath, image.buffer); // Save file locally
      const documentType =
        Document.documentType()[data.image_key.toUpperCase()] || null;

      if (!documentType) {
        return false;
      }

      const fileDetails = {
        form_type: formType,
        document_type: documentType,
        file: modifiedName,
        name: originalName,
        website_type: websiteType,
        context_id: data.id,
      };

      const args = {
        context_id: data.id,
        form_type: formType,
        document_type: documentType,
        website_type: websiteType,
      };

      const response = await Document.storeImage(args, fileDetails);
      if (response && response.status) {
        return response;
      }
      return false;
    } catch (error) {
      console.error("Image Upload Error:", error.message);
      return false;
    }
  },
};

module.exports = ImageLib;
