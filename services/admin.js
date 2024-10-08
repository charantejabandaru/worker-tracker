const mongoose = require('mongoose');
const dailyRecordModel = require('../models/dailyrecord');

exports.getEmployees = async (req, res) => {
    try {
        const result = await employeeModel.find({});
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
};

exports.getEmployeeByRole = async (req, res) => {
    try {
        const result = await employeeModel.find({ role: req.params.role });
        if (!result) {
            return res.status(404).json({ message: `Employee with role ${req.params.role} not found` });
        }
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};

exports.getEmployeeStatus = async (req, res) => {
    try {
        const result = await employeeModel.find({ status: req.params.status });
        if (!result) {
            return res.status(404).json({ message: `No one with status ${req.params.status}` });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};

exports.getLastAssignedWoryByEmployeeId = async (req, res) => {
    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        const dailyRecord = await dailyRecordModel.find({
            employeeId: employeeId
        }).sort({
            date: -1
        }).limit(1);
        return res.status(200).json({ "result": dailyRecord });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server side error" });
    }
};

exports.getSiteBySiteId = async (req, res) => {
    const { siteId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        const site = await siteModel.findById(siteId);
        if (site) {
            return res.status(200).json(site);
        } else {
            return res.status(404).json({ message: "Site Id not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server side error" });
    }
};

exports.updateRemark = (req, res) => {
    const { dailyRecordId } = req.params;
    const { adminRemark } = req.body;
    if (!mongoose.Types.ObjectId.isValid(dailyRecordId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    updateDailyRecord("adminRemark", adminRemark, dailyRecordId, res);
};

exports.addDailyRecord = async (req, res) => {
    try {
        const dailyRecord = req.body;
        await dailyRecordModel.create(dailyRecord);
        res.status(201).json({ message: 'Record added successfully' });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', details: error.message });
        }
    }
};

exports.getSitesBySiteAdminId = async (req, res) => {
    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        const sites = await siteModel.find({
            siteAdmins: employeeId
        });
        return res.status(200).json({ sites: sites });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server side error" });
    }
};

exports.updateWorkStatus = (req, res) => {
    const { dailyRecordId } = req.params;
    const { worksStatus } = req.body;
    if (!mongoose.Types.ObjectId.isValid(dailyRecordId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    updateDailyRecord("worksStatus", worksStatus, dailyRecordId, res);
};

