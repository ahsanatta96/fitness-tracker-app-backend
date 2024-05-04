const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to generate a random 6-digit code
function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
}

// Function to upload product image
const uploadTrainerDocuments = () => {
  const createDestinationDirectory = () => {
    const destinationPath = path.join(
      __dirname,
      "..",
      "api",
      "data",
      "trainerDocuments"
    );
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    return destinationPath;
  };

  return multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, createDestinationDirectory());
      },
      filename(req, file, cb) {
        const randomCode = generateRandomCode();
        const fileName = `${randomCode}_${file.originalname}`;
        cb(null, fileName);
      },
    }),
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|JPEG|jpg|JPG|png|PNG)$/)) {
        return cb(undefined, false);
      }
      cb(undefined, true);
    },
  });
};

module.exports = {
  uploadTrainerDocuments,
};
