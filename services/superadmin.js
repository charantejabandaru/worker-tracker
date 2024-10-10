const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const employeeModel = require('../models/employee');
const siteModel = require('../models/site');
const dailyRecordModel = require('../models/dailyrecord');
<<<<<<< Updated upstream
const siteAdminServices = require('./siteadmin');
const logService = require('./log');
=======
>>>>>>> Stashed changes

exports.register = async (req, res) => {
    const employee = req.body;
    const { password } = employee;
    if (!password) {
        return res.status(400).json({ message: "Password field is empty" });
    }
    employee.password = bcrypt.hashSync(password, 10);
    try {
        const newEmployee = await employeeModel.create(employee);
        await logService({
            modifierId: req.cookies.employee_details.id,
            employeeId: newEmployee._id,
            message: "Created new employee" 
        });
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
        console.log(site);
        const newSite = await siteModel.create(site);
        await logService({
            modifierId: req.cookies.employee_details.id,
            siteId: newSite._id,
            message: "Created new site" 
        });
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

exports.getAllDailyRecords = async (req, res) => {
    try {
        const results = await dailyRecordModel.find({});
        await setCheckinImagesIfExist(results);
        res.status(200).json(results);
    }
    catch(errro) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
}

exports.getTodayDailyRecords = async (req, res) => {
    try {
        const results = await dailyRecordModel.find({
            date: {
                $gte: new Date().setUTCHours(0,0,0,0)
            }
        });
        await setCheckinImagesIfExist(results);
        res.status(200).json(results);
    }
    catch(errro) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
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