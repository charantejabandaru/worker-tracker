const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../uploads/sites/${req.params.siteId}`));
    },
    filename: (req, file, cb) => {
        const time = new Date().getTime();
        cb(null, time+file.originalname);
        req.fileName = time+file.originalname;
    }
});

const uploadSite = multer({ storage: storage });

module.exports = uploadSite;