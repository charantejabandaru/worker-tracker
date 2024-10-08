const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/employees'));
    },
    filename: (req, file, cb) => {
        cb(null, req.params.employeeId);
    }
});

const uploadEmployee = multer({ storage: storage });

module.exports = uploadEmployee;