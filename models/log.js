const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    modifierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        requierd: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees'
    },
    siteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sites'
    },
    message: {
        type: String,
        required: true
    },
    timeStamps: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('logs', logSchema);