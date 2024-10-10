const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const employeeModel = require('../models/employee');
const dailyRecordModel = require('../models/dailyrecord');
const updateDailyRecord = require('./update-daily-record');

module.exports.checkLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Unsufficient data" });
        }
        const employee = await employeeModel.findOne({ email });
        if (!employee) {
            return res.status(401).json({ message: "Employee not found" });
        }
        const result = await bcrypt.compare(password, employee.password);
        if (result) {
            const payload = { role: employee.role };
            const token = jwt.sign(payload, process.env.SECRETKEY);
            res.status(200).cookie('employee_details', { id: employee._id, auth_token: `bearer ${token}` }, { maxAge: 9000000, httpOnly: true });
            return res.status(200).json({ message: "LoggedIn successfully" });
        } else {
            return res.status(401).json({ message: "Invalid password" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server side error" });
    }
};

module.exports.getEmployeeById = async (req, res) => {
    try {
        const { employeeId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const employee = await employeeModel.findById(employeeId);
        if (employee) {
            const {_id, name, email, mobile, role, skill, status , profilePhoto} = employee;

            const imageData  = await fs.readFile(profilePhoto.imageUrl);
            const ext = path.extname(profilePhoto.imageUrl);
            const mimeType = getMimeType(ext);
            const base64Image = Buffer.from(imageData).toString('base64');
            const profilePicture = `data:${mimeType};base64,${base64Image}`;

            const result = {_id, name, email, mobile, role, skill, status , profilePicture};
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "Employee Id not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server side error" , details: error.message});
    }
};

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

exports.updateEmployeeById = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const newEmployeeDetails = req.body;
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        if (!newEmployeeDetails) {
            return res.status(400).json({ message: "Required data is missing" })
        }
        if (newEmployeeDetails.password) {
            newEmployeeDetails.password = bcrypt.hashSync(newEmployeeDetails.password, 10);
        }
        const employee = await employeeModel.findByIdAndUpdate(employeeId, newEmployeeDetails, { new: true, runValidators: true });
        if (!employee) {
            return res.status(404).json({ message: "Employee Id not found" });
        }
        return res.status(200).json({ message: "Employee details updated successfully" });
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
};

exports.updateProfileImage = async (req, res) => {
    try {
        const newEmployee = {
            profilePhoto: {
                imageUrl: path.join(__dirname, `../uploads/employees/${req.params.employeeId}/${req.filename}`)
            }
        }
        const result = await employeeModel.findByIdAndUpdate(req.params.employeeId, newEmployee, { new: true, runValidators: true });
        if (!result) {
            return res.status(404).json({ message: `Employee not found with Id ${req.params.employeeId}` });
        }
        return res.status(200).json(result);
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

module.exports.getTasksById = async (req, res) => {
    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        const { employeeId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const tasks = await dailyRecordModel.find({
            employeeId: employeeId
        }).populate('siteId');
        return res.status(200).json({ tasks: tasks });
    } catch (error) {
        return res.status(500).json({ message: "Server side error" });
    }
};


module.exports.updateCheckin = async (req, res) => {
    try {
        req.body.data = JSON.parse(req.body.data);
        const filepath = path.join(__dirname, `../uploads/dailyrecords`);
        await createDirIfNotExists(filepath, req);
        await moveFiles(filepath, req);
        res.status(200).json({ message: 'image upload successful' });
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
};

module.exports.updateCheckout = async (req, res) => {
    try {
        const checkout = {
            location: req.body.location,
            timestamp: new Date()
        }
        await dailyRecordModel.findByIdAndUpdate(
            req.params.dailyRecordId,
            {
                "$push": { checkout: checkout }
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({ message: 'Updated successfully' });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Bad Request: Validation failed', details: error.message });
        }
        else if (error.code === 11000) {
            return res.status(409).json({ message: 'Conflict: Duplicate key error', details: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ message: "Server side error" });
        }
    }
};

const createDirIfNotExists = async (filepath, req) => {
    await fs.mkdir(`${filepath}/${formatDate()}`, { recursive: true });
    await fs.mkdir(`${filepath}/${formatDate()}/${req.body.data.employeeId}`, { recursive: true });
    await fs.mkdir(`${filepath}/${formatDate()}/${req.body.data.employeeId}/${req.params.dailyRecordId}`, { recursive: true });
}

const formatDate = () => {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    return `${day}-${month}-${year}`;
}

const moveFiles = async (filepath, req) => {
    const files = await fs.readdir(`${filepath}/temporary`);
    const oldFiles = await fs.readdir(`${filepath}/${formatDate()}/${req.body.data.employeeId}/${req.params.dailyRecordId}`);

    for (const file of files) {
        const oldPath = path.join(`${filepath}/temporary`, file);
        const newPath = path.join(`${filepath}/${formatDate()}/${req.body.data.employeeId}/${req.params.dailyRecordId}`, `${oldFiles.length + 1}${path.extname(file)}`);

        const checkin = {
            imageUrl: newPath,
            location: req.body.data.location,
            timestamp: new Date()
        }
        await dailyRecordModel.findByIdAndUpdate(
            req.params.dailyRecordId,
            {
                "$push": { checkin: checkin }
            },
            { new: true, runValidators: true }
        );

        await fs.rename(oldPath, newPath);
    }
}

module.exports.updateEmployeeRemark = (req, res) => {
    const { dailyRecordId } = req.params;
    const { technicianRemark } = req.body;
    if (!mongoose.Types.ObjectId.isValid(dailyRecordId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    updateDailyRecord("technicianRemark", technicianRemark, dailyRecordId, res);
}

exports.getAllDailyRecordsByEmployeeId = async (req, res) => {
    try {
        const results = await dailyRecordModel.find({employeeId: req.params.employeeId});
        if (results.length === 0) {
            return res.status(404).json({ message: `Records with siteId ${req.params.siteId} not found` });
        }
        await setCheckinImagesIfExist(results);
        res.status(200).json(results);
    }
    catch(errro) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
}

exports.getTodayDailyRecordsBySite = async (req, res) => {
    try {
        const results = await dailyRecordModel.find({
            date: {
                $gte: new Date().setUTCHours(0,0,0,0)
            },
            employeeId: req.params.employeeId
        });
        if (results.length === 0) {
            return res.status(404).json({ message: `Records with siteId ${req.params.siteId} not found` });
        }
        await setCheckinImagesIfExist(results);
        res.status(200).json(results);
    }
    catch(errro) {
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