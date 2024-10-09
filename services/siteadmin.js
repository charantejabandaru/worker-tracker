const mongoose = require('mongoose');
const siteModel = require('../models/site');
const dailyRecordModel = require('../models/dailyrecord');
const updateDailyRecord = require('./update-daily-record');


exports.getDailyRecordsBySiteId = async (req, res) => {
    try {
        const { siteId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const dailyRecords = await dailyRecordModel.find({
            siteId: siteId
        }).populate('employeeId');
        return res.status(200).json({ dailyRecords: dailyRecords });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server side error" });
    }
}

const errorHandler = (error, res) => {
    if (error.name === 'ValidationError') {
        res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
    }
    else if (error.code === 11000) {
        res.status(409).json({ message: 'Conflict: Duplicate key error', details: error.message });
    }
    else {
        res.status(500).json({ message: 'Internal Server Error', details: error.message });
    }
}

module.exports.updateRemark = (req, res) => {
    const { dailyRecordId } = req.params;
    const { adminRemark } = req.body;
    if (!mongoose.Types.ObjectId.isValid(dailyRecordId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    updateDailyRecord("adminRemark", adminRemark, dailyRecordId, res);
};

module.exports.updateWorkStatus = (req, res) => {
    const { dailyRecordId } = req.params;
    const { worksStatus } = req.body;
    if (!mongoose.Types.ObjectId.isValid(dailyRecordId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    updateDailyRecord("worksStatus", worksStatus, dailyRecordId, res);
};

module.exports.updateWorkAssigned = (req, res) => {
    const { dailyRecordId } = req.params;
    const { workAssigned } = req.body;
    if (!mongoose.Types.ObjectId.isValid(dailyRecordId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    updateDailyRecord("workAssigned", workAssigned, dailyRecordId, res);
};

exports.updateProgress = async (req, res) => {
    const { siteId } = req.params;
    const { progressImages } = req.body;
    await this.updateProgressImages(siteId, progressImages);
};

exports.updateProgressImages = async (siteId, progressImages) => {
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    if (progressImages) {
        try {
            const result = await siteModel.findByIdAndUpdate(
                siteId,
                {
                    "$push": { progressImages: progressImages }
                },
                { new: true, runValidators: true }
            );
            if (result) {
                return res.status(200).json({
                    message: "Progress updated successfully",
                    details: result
                });
            } else {
                return res.status(404).json({ message: "Site Id not found" });
            }
        } catch (error) {
            errorHandler(error, res);
        }
    } else {
        return res.status(400).json({ message: "Body data not found" });
    }
}