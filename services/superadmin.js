const employeeModel = require('../models/employee');
const siteModel = require('../models/site');
const dailyRecordModel = require('../models/dailyrecord');

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