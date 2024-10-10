const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const progressModel = require('../models/progress');
const dailyRecordModel = require('../models/dailyrecord');
const employeeModel = require('../models/employee');
const siteModel = require('../models/site');
const logService = require('./log');
const logModel = require('../models/log');

exports.getEmployees = async (req, res) => {
    try {
        const results = await employeeModel.find({});
        const employees = results.map((result) => {
            const { _id, name, email, mobile, role, skill, status } = result;
            return { _id, name, email, mobile, role, skill, status };
        });
        res.status(200).json(employees);
    }
    catch (error) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
};

exports.getEmployeeByRole = async (req, res) => {
    try {
        const results = await employeeModel.find({ role: req.params.role });
        if (results.length === 0) {
            return res.status(404).json({ message: `Employee with role ${req.params.role} not found` });
        }
        const employees = results.map((result) => {
            const { _id, name, email, mobile, role, skill, status } = result;
            return { _id, name, email, mobile, role, skill, status };
        });
        res.status(200).json(employees);
    }
    catch (error) {
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};

exports.getEmployeeStatus = async (req, res) => {
    try {
        const results = await employeeModel.find({ status: req.params.status });
        if (results.length === 0) {
            return res.status(404).json({ message: `No one with status ${req.params.status}` });
        }
        const employees = results.map((result) => {
            const { _id, name, email, mobile, role, skill, status } = result;
            return { _id, name, email, mobile, role, skill, status };
        });
        res.status(200).json(employees);
    }
    catch (error) {
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
};

exports.getLastAssignedWoryByEmployeeId = async (req, res) => {
    try {
        const { employeeId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const dailyRecord = await dailyRecordModel.find({
            employeeId: employeeId
        }).sort({
            date: -1
        }).limit(1);
        return res.status(200).json({ "result": dailyRecord });
    } catch (error) {
        return res.status(500).json({ message: "Server side error" });
    }
};

exports.getSiteBySiteId = async (req, res) => {
    try {
        const { siteId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const site = await siteModel.findById(siteId);
        if (site) {
            return res.status(200).json(site);
        } else {
            return res.status(404).json({ message: "Site Id not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server side error" });
    }
};

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
        dailyRecord.date = new Date();
        await dailyRecordModel.create(dailyRecord);
        await logService({
            modifierId: req.cookies.employee_details.id,
            employeeId: dailyRecord.employeeId,
            operation: "assignedWork",
            message: "Assigned work to"
        });
        res.status(201).json({ message: 'Record added successfully' });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        } else if (error.code === 11000) {
            return res.status(409).json({ message: 'Conflict: Duplicate key error', details: error.message });
        } else {
            res.status(500).json({ message: 'Internal Server Error', details: error.message });
        }
    }
};

exports.getSitesBySiteAdminId = async (req, res) => {
    try {
        const { employeeId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const sites = await siteModel.find({
            siteAdmins: employeeId
        });
        return res.status(200).json({ sites: sites });
    } catch (error) {
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

exports.addProgressImage = async (req, res) => {
    try {
        req.body.data = JSON.parse(req.body.data);
        const filepath = path.join(__dirname, `../uploads/progress`);
        await createDirIfNotExists(filepath, req);
        await moveFiles(filepath, req);
        res.status(200).json({ message: 'image upload successful' });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        res.status(500).json({ message: "Error occured while uploading image", details: error.message });
    }
}

exports.updateProgressImage = async (req, res) => {
    try {
        req.body.data = JSON.parse(req.body.data);
        const progress = req.body.data;
        const targetImagePath = progress.imageUrl;
        const filepath = path.join(__dirname, `../uploads/progress`);
        const files = await fs.readdir(`${filepath}/temporary`);
        const sourceImagePath = `${filepath}/temporary/${files[0]}`;
        await fs.copyFile(sourceImagePath, targetImagePath);
        await fs.unlink(`${filepath}/temporary/${files[0]}`);
        res.status(200).json({ message: 'Updated progress image successfully' });
    }
    catch (error) {
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
}

const formatDate = () => {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    return `${day}-${month}-${year}`;
}

const createDirIfNotExists = async (filepath, req) => {
    await fs.mkdir(`${filepath}/${req.body.data.siteId}`, { recursive: true });
    await fs.mkdir(`${filepath}/${req.body.data.siteId}/${formatDate()}`, { recursive: true });
}

const moveFiles = async (filepath, req) => {
    const files = await fs.readdir(`${filepath}/temporary`);

    for (const file of files) {
        const oldPath = path.join(`${filepath}/temporary`, file);
        const newPath = path.join(`${filepath}/${req.body.data.siteId}/${formatDate()}`, file);
        const progress = req.body.data;
        progress.imageUrl = newPath;
        progress.date = formatDate();
        await progressModel.create(progress);
        await fs.rename(oldPath, newPath);
    }
}

exports.getProgressBySite = async (req, res) => {
    try {
        const results = await progressModel.find({ siteId: req.params.siteId });
        if (results.length === 0) {
            return res.status(404).json({ message: "No progress foound with siteId " + req.params.siteId });
        }
        const progressImages = await Promise.all(
            results.map(async (result) => {
                const imageData = await fs.readFile(result.imageUrl);
                const ext = path.extname(result.imageUrl);
                const mimeType = getMimeType(ext);
                const base64Image = Buffer.from(imageData).toString('base64');
                const progressImage = `data:${mimeType};base64,${base64Image}`;

                const { siteId, name, comments, date } = result;
                return { siteId, name, comments, date, progressImage };
            })
        );

        res.status(200).json(progressImages);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
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

const getLogsByCondition = async (res, condition) => {
    const logs = await logModel.find(condition).populate('modifierId').populate('employeeId').populate('siteId');
    return res.status(200).json({ logs });
}

exports.getLogs = async (req, res) => {
    try {
        getLogsByCondition(res, {});
    } catch (error) {
        return res.status(500).json({ message: "Server side error" });
    }
};

exports.getLogsByOperation = async (req, res) => {
    try {
        const { operation } = req.params;
        getLogsByCondition(res, { operation });
    } catch (error) {
        return res.status(500).json({ message: "Server side error" });
    }
};

exports.getLogsByModifierId = async (req, res) => {
    try {
        const { modifierId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(modifierId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        getLogsByCondition(res, { modifierId });
    } catch (error) {
        return res.status(500).json({ message: "Server side error" });
    }
};