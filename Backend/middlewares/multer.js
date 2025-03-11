import multer from "multer"; //designed for handling file upload

// creating a disk storage config for multer, it tells multer where and how to store the uploaded files.
const storage = multer.diskStorage({  
  filename: function (req, file, callback) { // The func determines the name of the saved file.
    callback(null, file.originalname); // This tells multer to save the file with its originalName.
  },
});

const upload = multer({ storage }); // creating an upload instance of multer.

export default upload;
