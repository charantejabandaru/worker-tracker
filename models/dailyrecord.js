const mongoose = require('mongoose');

const dailyRecordSchema = mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employees',
            required: true
        },
        siteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sites',
            required: true
        },
        checkin: [{
            imageUrl: {
                type: String,
                unique: true
            },
            location: {
                type: String
            },
            timestamp: {
                type: String
            }
        }],
        checkout: [{
            location: {
                type: String
            },
            timestamp: {
                type: String
            }
        }],
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
            type: Date
        }
    }
);

const dailyRecordModel = mongoose.model('dailyrecords',dailyRecordSchema);

module.exports = dailyRecordModel;