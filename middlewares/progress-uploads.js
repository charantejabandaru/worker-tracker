const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../uploads/progress/${req.params.siteId}/${new Date()}`));
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    }
});

const uploadSite = multer({ storage: storage });

module.exports = uploadSite;