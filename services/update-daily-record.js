const dailyRecordModel = require('../models/dailyrecord');

module.exports = async (fieldName, value, dailyRecordId, res) => {
    if (!value) {
        return res.status(400).json({ message: "Body data not found" })
    }
    try {
        const result = await dailyRecordModel.findByIdAndUpdate(dailyRecordId,
            { [fieldName]: value },
            { new: true, runValidators: true }
        )
        if (result) {
            return res.status(200).json({
                "message": `${fieldName} updated successfully`,
                "details": result
            });
        } else {
            return res.status(404).json({ message: "Daily Record Id not found" });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad Request: Validation failed', details: error.message });
        }
        else if (error.code === 11000) {
            return res.status(409).json({ error: 'Conflict: Duplicate key error', details: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ message: "Server side error" });
        }
    }
}