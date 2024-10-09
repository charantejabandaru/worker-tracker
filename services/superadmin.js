const bcrypt = require('bcrypt');
const employeeModel = require('../models/employee');
const siteModel = require('../models/site');
const dailyRecordModel = require('../models/dailyrecord');
const siteAdminServices = require('./siteadmin');

exports.register = async (req, res) => {
    const employee = req.body;
    const { password } = employee;
    if (!password) {
        return res.status(400).json({ message: "Password field is empty" });
    }
    employee.password = bcrypt.hashSync(password, 10);
    try {
        await employeeModel.create(employee);
        res.status(201).json({ message: 'Employee registered successfully' });
    }
    catch (error) {
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
}

exports.getEmployeeBySpecification = async (req, res) => {
    try {
        const result = await employeeModel.find({ specification: req.params.specification });
        if (!result) {
            return res.status(404).json({ message: `Employee with specification ${req.params.specification} not found` });
        }
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
}

exports.removeEmployee = async (req, res) => {
    try {
        const result = await employeeModel.deleteOne({ _id: req.params.employeeId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee removed successfully' });
    }
    catch (error) {
        if (error.kind === 'ObjectId') {
            res.status(400).json({ message: 'Bad Request: Invalid employee ID' });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', details: error.message });
        }
    }
}

exports.addSite = async (req, res) => {
    try {
        const site = req.body;
        await siteModel.create(site);
        res.status(201).json({ message: 'Site added successfully' });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', details: error.message });
        }
    }
}

exports.getSites = async (req, res) => {
    try {
        const result = await siteModel.find({});
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
}

exports.getSiteByLocation = async (req, res) => {
    try {
        const result = await siteModel.findOne({ location: req.params.location });
        if (!result) {
            return res.status(404).json({ message: "No sites in " + req.params.location });
        }
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
}

exports.updateSite = async (req, res) => {
    try {
        const newSite = req.body;
        const siteId = req.params.siteId;
        const { progressImages } = newSite;
        const { siteAdmins } = newSite;
        if (progressImages) {
            await siteAdminServices.updateProgressImages(siteId, progressImages);
        }
        else if (siteAdmins) {
            try {
                const result = await siteModel.findByIdAndUpdate(
                    siteId,
                    {
                        "$push": { siteAdmins: siteAdmins }
                    },
                    { new: true, runValidators: true }
                );
                if (result) {
                    return res.status(200).json({
                        message: "Admins updated successfully",
                        details: result
                    });
                } else {
                    return res.status(404).json({ message: "Site Id not found" });
                }
            }
            catch (error) {
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
        }
        else {
            const result = await siteModel.findByIdAndUpdate(siteId, newSite, { new: true, runValidators: true });
            if (!result) {
                return res.status(404).json({ message: `Site not found with Id ${siteId}` });
            }
            return res.status(200).json(result);
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
}

exports.removeSite = async (req, res) => {
    try {
        const result = await siteModel.deleteOne({ _id: req.params.siteId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Site not found' });
        }
        res.status(200).json({ message: 'Site removed successfully' });
    }
    catch (error) {
        if (error.kind === 'ObjectId') {
            res.status(400).json({ message: 'Bad Request: Invalid site ID' });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', details: error.message });
        }
    }
}

exports.removeDailyRecord = async (req, res) => {
    try {
        const result = await dailyRecordModel.deleteOne({ _id: req.params.dailyRecordId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json({ message: 'Record removed successfully' });
    }
    catch (error) {
        if (error.kind === 'ObjectId') {
            res.status(400).json({ message: 'Bad Request: Invalid record ID' });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error', details: error.message });
        }
    }
}
