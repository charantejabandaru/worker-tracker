const employeeModel = require('../models/employee');
const siteModel = require('../models/site');
const dailyRecordModel = require('../models/dailyrecord');
const resourceModel = require('../models/resource');

exports.register = async (req, res) => {
    try {
        const employee = req.body;
        await employeeModel.create(employee);
        res.status(201).json({message: 'Employee registered successfully'});
    }
    catch(error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({error: 'Bad Request: Validation failed', details: error.message});
        } 
        else if (error.code === 11000) {
            res.status(409).json({error: 'Conflict: Duplicate key error', details: error.message});
        } 
        else {
            res.status(500).json({error: 'Internal Server Error', details: error.message});
        }
    }
}

exports.getEmployees = async (req, res) => {
    try {
        const result = await employeeModel.find({});
        res.status(200).json(result);
    }
    catch(error) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
}

exports.removeEmployee = async (req, res) => {
    try {
        const result = await employeeModel.deleteOne({_id: req.params.employeeId});
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({message: 'Employee removed successfully'});
    }
    catch(error) {
        if (error.kind === 'ObjectId') {
            res.status(400).json({ error: 'Bad Request: Invalid employee ID' });
        } 
        else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}

exports.addSite = async (req, res) => {
    try{
        const site = req.body;
        await siteModel.create(site);
        res.status(201).json({message: 'Site added successfully'});
    }
    catch(error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({error: 'Bad Request: Validation failed', details: error.message});
        }
        else {
            res.status(500).json({error: 'Internal Server Error', details: error.message});
        }
    }
}

exports.getSites = async (req, res) => {
    try {
        const result = await siteModel.find({});
        res.status(200).json(result);
    }
    catch(error) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
}

exports.removeSite = async (req, res) => {
    try {
        const result = await siteModel.deleteOne({_id: req.params.siteId});
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Site not found' });
        }
        res.status(200).json({message: 'Site removed successfully'});
    }
    catch(error) {
        if (error.kind === 'ObjectId') {
            res.status(400).json({ error: 'Bad Request: Invalid site ID' });
        } 
        else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}

exports.addDailyRecord = async (req, res) => {
    try {
        const dailyRecord = req.body;
        await dailyRecordModel.create(dailyRecord);
        res.status(201).json({message: 'Record added successfully'});
    }
    catch(error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({error: 'Bad Request: Validation failed', details: error.message});
        }
        else {
            res.status(500).json({error: 'Internal Server Error', details: error.message});
        }
    }
}

exports.removeDailyRecord = async (req, res) => {
    try {
        const result = await dailyRecordModel.deleteOne({_id: req.params.dailyRecordId});
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({message: 'Record removed successfully'});
    }
    catch(error) {
        if (error.kind === 'ObjectId') {
            res.status(400).json({ error: 'Bad Request: Invalid record ID' });
        } 
        else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}

exports.getRequests = async () => {
    try {
        const result = await resourceModel.find({});
        res.status(200).json(result);
    }
    catch(error) {
        res.status(500).json({ message: "Server error. Could not fetch resources." });
    }
}

exports.deleteRequest = async (req, res) => {
    try {
        const result = await resourceModel.deleteOne({_id: req.params.requestId});
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.status(200).json({message: 'Request deleted successfully'});
    }
    catch(error) {
        if (error.kind === 'ObjectId') {
            res.status(400).json({ error: 'Bad Request: Invalid request ID' });
        } 
        else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
}