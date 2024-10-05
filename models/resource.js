const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema(
    {
        siteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sites',
            required: true
        },
        numberOfEmployees: {
            type: Map,
            of: Number
        }
    }
);

const resourceModel = mongoose.model('resources',resourceSchema);

module.exports = resourceModel;