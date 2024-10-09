const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        await removeDirectory(path.join(__dirname, `../uploads/employees/${req.params.employeeId}`));
        await fs.mkdir(path.join(__dirname, `../uploads/employees/${req.params.employeeId}`), { recursive: true });
        cb(null, path.join(__dirname, `../uploads/employees/${req.params.employeeId}`));
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, req.params.employeeId+extension);
        req.filename = req.params.employeeId+extension;
    }
});

async function removeDirectory(directoryPath) {
    try {
        await fs.rm(directoryPath, { recursive: true, force: true });
    } catch (err) {
        console.error(`Error removing directory: ${err}`);
    }
}

const uploadEmployee = multer({ storage: storage });

module.exports = uploadEmployee;