const express = require('express');
const employeeRouter = express.Router();
const employeeServices = require('../services/employee');

// employeeRouter.post('/login', employeeServices.checkLogin);
// employeeRouter.get('/employee/:employeeId', employeeServices.getEmployeeById);
// employeeRouter.get('/employee/dailyRecord/:employeeId', employeeServices.getTasksById);
// employeeRouter.put('/checkin/:dailyRecordId', employeeServices.updateCheckin);
// employeeRouter.put('/checkout/:dailyRecordId', employeeServices.updateCheckout);
// employeeRouter.put('/employee/remark/:dailyRecordId', employeeServices.updateEmployeeRemark);

module.exports = employeeRouter;


//post('/login')
//get('/employee/:employeeId')
//put('/employee/:employeeId')
//put('/checkin/:dailyRecordId')
//put('/checkout/:dailyRecordId')
//get('/employee/dailyrecord/:employeeId')
//put('/employee/remark/:dailyRecordId')

//Common for all users
//
//put('/workstatus/:dailyRecordId')