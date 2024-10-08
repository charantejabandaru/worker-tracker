const express = require('express');
const employeeRouter = express.Router();
const employeeServices = require('../services/employee');

employeeRouter.post('/login', employeeServices.checkLogin);
employeeRouter.get('/employee/:employeeId', employeeServices.getEmployeeById);
employeeRouter.get('/employee/dailyRecord/:employeeId', employeeServices.getTasksById);
employeeRouter.put('/checkin/:dailyRecordId', employeeServices.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', employeeServices.updateCheckout);
employeeRouter.put('/employee/remark/:dailyRecordId', employeeServices.updateEmployeeRemark);

module.exports = employeeRouter;