const mongoose = require('mongoose');

const dailyRecordSchema = mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        siteId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        checkin: {
            imageUrl: {
                type: String,
                unique: true
            },
            location: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        },
        checkout: {
            location: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        },
        workAssigned: {
            type: String,
            required: true
        },
        worksStatus: {
            type: String,
            enum: ['Completed','Incomplete','Pending','On hold']
        },
        adminRemark: {
            type: String
        },
        technicianRemark: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
);

const dailyRecordModel = mongoose.model('dailyrecords',dailyRecordSchema);

module.exports = dailyRecordModel;