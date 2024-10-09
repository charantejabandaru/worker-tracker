const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const progressModel = require('../models/progress');
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

exports.addProgressImage = async (req, res) => {
    try {
        req.body.data = JSON.parse(req.body.data);
        const filepath = path.join(__dirname, `../uploads/progress`);
        await createDirIfNotExists(filepath, req);
        await moveFiles(filepath, req);
        res.status(200).json({message: 'image upload successful'});
    }
    catch(error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        res.status(500).json({message: "Error occured while uploading image", details: error.message});
    }
}

exports.updateProgressImage = async (req, res) => {
    try {
         req.body.data = JSON.parse(req.body.data);
        const progress = req.body.data;
        const sourceImagePath = progress.imageUrl;
        const filepath = path.join(__dirname, `../uploads/progress`);
        const files = await fs.readdir(`${filepath}/temporary`);
        const targetImagePath = `${filepath}/temporary/${files[0]}`;
        console.log(targetImagePath);
        await fs.copyFile(sourceImagePath, targetImagePath);
        res.status(200).json({message: 'Updated progress'});
    }
    catch(error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        else if (error.code === 11000) {
            return res.status(409).json({ message: 'Conflict: Duplicate key error', details: error.message });
        } 
        else {
            res.status(500).json({message: "Error occured while uploading image", details: error.message});
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

