const mongoose = require('mongoose');

const dailyRecordSchema = mongoose.Schema(
    {
        
    }
);

const dailyRecordModel = mongoose.model('dailyrecords',dailyRecordSchema);

module.exports = dailyRecordModel;