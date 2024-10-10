const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
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

exports.getAllDailyRecordsBySite = async (req, res) => {
    try {
        const results = await dailyRecordModel.find({sitedId: req.params.siteId});
        if (results.length === 0) {
            return res.status(404).json({ message: `Records with siteId ${req.params.siteId} not found` });
        }
        await setCheckinImagesIfExist(results);
        res.status(200).json(results);
    }
    catch(error) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
}

exports.getTodayDailyRecordsBySite = async (req, res) => {
    try {
        const results = await dailyRecordModel.find({
            date: {
                $gte: new Date().setUTCHours(0,0,0,0)
            },
            siteId : req.params.siteId
        });
        if (results.length === 0) {
            return res.status(404).json({ message: `Records with siteId ${req.params.siteId} not found` });
        }
        await setCheckinImagesIfExist(results);
        res.status(200).json(results);
    }
    catch(error) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
}

const setCheckinImagesIfExist = async (results) => {
    const dailyRecords = await Promise.all(
        results.map(async (result) => {
            if (result.checkin) {
                const checkin = await Promise.all(result.checkin.map(async (entry) => {
                    const imageData = await fs.readFile(entry.imageUrl);
                    const ext = path.extname(entry.imageUrl);
                    const mimeType = getMimeType(ext);
                    const base64Image = Buffer.from(imageData).toString('base64');
                    const obj = {
                        image: `data:${mimeType};base64,${base64Image}`,
                        location: entry.location,
                        timestamp: entry.timestamp
                    };
                    return obj;
                }));
                result.checkin = checkin;
            }
            return result;
        })
    );    
    return dailyRecords;
}

function getMimeType(ext) {
    switch (ext) {
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.svg':
            return 'image/svg+xml';
        default:
            return 'application/octet-stream';
    }
}