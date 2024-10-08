const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../uploads/dailyrecords/${req.params.dailyrecordId}`));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
        req.filename = file.originalname;
    }
});

const uploadRecord = multer({ storage: storage });

module.exports = uploadRecord;