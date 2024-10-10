const mongoose = require('mongoose');

const siteSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        location: {
            type:  [Number],
            required: true
        },
        info: {
            type: String
        },
        siteAdmins: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employees'
        }]
    }
);

const siteModel = mongoose.model('sites', siteSchema);

module.exports = siteModel;