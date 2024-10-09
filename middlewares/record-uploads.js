const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../uploads/dailyrecords/temporary`));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadRecord = multer({ storage: storage });

module.exports = uploadRecord;