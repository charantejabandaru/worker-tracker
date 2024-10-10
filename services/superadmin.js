const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const employeeModel = require('../models/employee');
const siteModel = require('../models/site');
const dailyRecordModel = require('../models/dailyrecord');
const logService = require('./log');

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
            operation: "createdEmployee",
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
        const newSite = await siteModel.create(site);
        await logService({
            modifierId: req.cookies.employee_details.id,
            siteId: newSite._id,
            operation: "createdSite",
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

exports.updateSiteBasicInfo = async (req, res) => {
    try {
        const { siteId } = req.params;
        const newSiteDetails = req.body;
        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        if (!newSiteDetails) {
            return res.status(400).json({ message: "No data in request body" });
        }
        delete newSiteDetails.siteAdmins;
        const result = await siteModel.findByIdAndUpdate(siteId, newSiteDetails, { new: true, runValidators: true });
        if (!result) {
            return res.status(404).json({ messsage: "Site Id not found" });
        }
        await logService({
            modifierId: req.cookies.employee_details.id,
            siteId: result._id,
            operation: "updatedSite",
            message: "Updated site details"
        });
        return res.status(200).json({ message: "Successfully updated site details" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        else if (error.code === 11000) {
            return res.status(409).json({ message: 'Conflict: Duplicate key error', details: error.message });
        }
        else {
            res.status(500).json({ message: "Error occured while uploading image", details: error.message });
        }
    }
};

exports.addSiteAdminsIntoSite = async (req, res) => {
    try {
        const { siteId } = req.params;
        const { siteAdmins } = req.body;
        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        if (!siteAdmins) {
            return res.status(400).json({ message: "No siteadmins data in the request body" });
        }
        const result = await siteModel.findByIdAndUpdate(
            siteId,
            {
                "$push": {
                    siteAdmins: {
                        "$each": siteAdmins
                    }
                }
            },
            { new: true, runValidators: true }
        );
        if (!result) {
            return res.status(404).json({ message: "Site Id not found" });
        }
        await logService({
            modifierId: req.cookies.employee_details.id,
            siteId: result._id,
            operation: "addedAdmin",
            message: "Added site admins"
        });
        return res.status(200).json({ message: "Site admins added successfully into site" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        else if (error.code === 11000) {
            return res.status(409).json({ message: 'Conflict: Duplicate key error', details: error.message });
        }
        else {
            res.status(500).json({ message: "Error occured while uploading image", details: error.message });
        }
    }
};

exports.deleteSiteAdminsIntoSite = async (req, res) => {
    try {
        const { siteId } = req.params;
        const { siteAdmins } = req.body;
        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        if (!siteAdmins) {
            return res.status(400).json({ message: "No siteadmins data in the request body" });
        }
        const result = await siteModel.findByIdAndUpdate(
            siteId,
            {
                "$pull": {
                    siteAdmins: {
                        "$in": siteAdmins
                    }
                }
            },
            { new: true, runValidators: true }
        );
        if (!result) {
            return res.status(404).json({ message: "Site Id not found" });
        }
        await logService({
            modifierId: req.cookies.employee_details.id,
            siteId: result._id,
            operation: "deletedAdmin",
            message: "Deleted site admins"
        });
        return res.status(200).json({ message: "Site admins deleted successfully from site" });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        else if (error.code === 11000) {
            return res.status(409).json({ message: 'Conflict: Duplicate key error', details: error.message });
        }
        else {
            res.status(500).json({ message: "Error occured while uploading image", details: error.message });
        }
    }
};

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
    catch(error) {
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
    catch(error) {
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