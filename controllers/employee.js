//get('/employee/:employeeId')
//post('/login')
//get('/task/:employeeId')
//put('/checkin/:dailyRecordId')
//put('/checkout/:dailyRecordId')
//put('/employee/remark/:dailyRecordId')

const express = require('express');
const employeeRouter = express.Router();
const employeeController = require('../services/employee');

employeeRouter.get('/employee/:employeeId', employeeController.getEmployeeById);
employeeRouter.get('/task/:employeeId', employeeController.getTasksById);
employeeRouter.put('/checkin/:dailyRecordId', employeeController.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', employeeController.updateCheckout);
employeeRouter.put('/employee/remark/:dailyRecordId', employeeController.updateEmployeeRemark);
// employeeRouter.put
// employeeRouter.post('/', employeeController.createEmployees);

module.exports = employeeRouter;