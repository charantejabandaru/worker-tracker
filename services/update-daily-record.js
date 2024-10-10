const dailyRecordModel = require('../models/dailyrecord');

exports.updateDailyRecord = async (req, res) => {
    try {
        const result = await dailyRecordModel.findByIdAndUpdate(req.params.dailyRecordId,
            req.body,
            { new: true, runValidators: true }
        )
        if (result) {
            return res.status(200).json({
                "message": `Record updated successfully`,
                "details": result
            });
        } else {
            return res.status(404).json({ message: "Daily Record Id not found" });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        else if (error.code === 11000) {
            return res.status(409).json({ message: 'Conflict: Duplicate key error', details: error.message });
        } else {
            return res.status(500).json({ message: "Server side error" });
        }
    }
}