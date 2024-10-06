const mongoose = require('mongoose');
const employeeModel = require('../models/employee');
const dailyRecordModel = require('../models/dailyrecord');

module.exports.getEmployeeById = async (req, res) => {
    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        const employee = await employeeModel.findById(employeeId);
        if (employee) {
            return res.status(200).json(employee);
        } else {
            return res.status(404).json({ message: "Employee Id not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server side error" });
    }
};

module.exports.getTasksById = async (req, res) => {
    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        const tasks = await dailyRecordModel.find({
            employeeId: employeeId
        }).populate('siteId');
        return res.status(200).json({ tasks: tasks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server side error" });
    }
};

const updateDailyRecord = async (fieldName, value, dailyRecordId, res) => {
    if (!value) {
        return res.status(400).json({ message: "Invalid data" })
    }
    try {
        const result = await dailyRecordModel.findByIdAndUpdate(dailyRecordId,
            { [fieldName]: value },
            { new: true, runValidators: true }
        )
        if (result) {
            return res.status(200).json({
                "message": `${fieldName} updated successfully`,
                "updated": result
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

module.exports.updateCheckin = (req, res) => {
    const { dailyRecordId } = req.params;
    const { checkin } = req.body;
    if (!mongoose.Types.ObjectId.isValid(dailyRecordId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    updateDailyRecord("checkin", checkin, dailyRecordId, res);
};

module.exports.updateCheckout = (req, res) => {
    const { dailyRecordId } = req.params;
    const { checkout } = req.body;
    if (!mongoose.Types.ObjectId.isValid(dailyRecordId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    updateDailyRecord("checkout", checkout, dailyRecordId, res);
};

module.exports.updateEmployeeRemark = (req, res) => {
    const { dailyRecordId } = req.params;
    const { technicianRemark } = req.body;
    if (!mongoose.Types.ObjectId.isValid(dailyRecordId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    updateDailyRecord("technicianRemark", technicianRemark, dailyRecordId, res);
}