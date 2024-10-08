const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `../uploads/dailyrecords/${new Date()}/${req.body.employeeId}`));
    },
    filename: (req, file, cb) => {
        countFilesInFolder(folderPath)
        .then(fileCount =>{
            cb(null, fileCount+1);
            req.filename = fileCount+1;
        })
        .catch(err => console.error(err));  
    }
});

function countFilesInFolder(folderPath) {
    return new Promise((resolve, reject) => {
      fs.readdir(folderPath, (err, files) => {
        if (err) {
          return reject('Unable to scan directory: ' + err);
        }
  
        const fileCount = files.filter(file => {
          const filePath = path.join(folderPath, file);
          return fs.lstatSync(filePath).isFile();
        }).length;
  
        resolve(fileCount);
      });
    });
  }

const uploadRecord = multer({ storage: storage });

module.exports = uploadRecord;