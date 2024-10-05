const mongoose = require('mongoose');

const siteSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        info: {
            type: String
        },
        progressImages: [{
            imageUrl: {
                type: String,
                unique: true
              },
              timestamp: {
                type: Date,
                default: Date.now,
              }
        }],
        siteAdmins: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }]
    }
);

const siteModel = mongoose.model('sites',siteSchema);

module.exports = siteModel;