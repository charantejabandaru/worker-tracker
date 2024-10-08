const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const employeeModel = require('../models/employee');
const dailyRecordModel = require('../models/dailyrecord');
const updateDailyRecord = require('./update-daily-record');

module.exports.checkLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Unsufficient data" });
    }
    try {
        const employee = await employeeModel.findOne({ email });
        if (!employee) {
            return res.status(401).json({ message: "Employee not found" });
        }
        const result = await bcrypt.compare(password, employee.password);
        if (result) {
            const payload = { id: employee._id, role: employee.role };
            const token = jwt.sign(payload, process.env.SCRETKEY);
            return res.status(200).json({ 'auth_token': token });
        } else {
            return res.status(401).json({ message: "Invalid password" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server side error" });
    }
};

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
        return res.status(500).json({ message: "Server side error" });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const newEmployee = req.body;
        const result = await employeeModel.findByIdAndUpdate(req.params.employeeId, newEmployee, { new: true, runValidators: true });
        if (!result) {
            return res.status(404).json({ message: `Employee not found with Id ${req.params.employeeId}` });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Server error occurred. Please try again later." });
    }
}

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
        return res.status(500).json({ message: "Server side error" });
    }
};


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