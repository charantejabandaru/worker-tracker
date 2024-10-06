//get('/employee/:employeeId')
//post('/login')
//get('/employee/dailyRecord/:employeeId')
//put('/checkin/:dailyRecordId')
//put('/checkout/:dailyRecordId')
//put('/employee/remark/:dailyRecordId')

const express = require('express');
const employeeRouter = express.Router();
const employeeController = require('../services/employee');

employeeRouter.get('/employee/:employeeId', employeeController.getEmployeeById);
employeeRouter.get('/employee/dailyRecord/:employeeId', employeeController.getTasksById);
employeeRouter.put('/checkin/:dailyRecordId', employeeController.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', employeeController.updateCheckout);
employeeRouter.put('/employee/remark/:dailyRecordId', employeeController.updateEmployeeRemark);

module.exports = employeeRouter;