const mongoose = require('mongoose');

const progressSchema = mongoose.Schema(
    {
        siteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sites',
            required: true
        },
        imageUrl: {
            type: String,
            unique: true
        },
        name: {
            type: String
        },
        comments: {
            type: String
        },
        date: {
            type: String
        }
    }
);

const progressModel = mongoose.model('progresses', progressSchema);

module.exports = progressModel;