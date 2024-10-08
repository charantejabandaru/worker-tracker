const express = require('express');
const employeeRouter = express.Router();
const employeeServices = require('../services/employee');

employeeRouter.get('/employee/:employeeId', employeeServices.getEmployeeById);
employeeRouter.get('/employee/dailyRecord/:employeeId', employeeServices.getTasksById);
employeeRouter.put('/employee/:employeeId', employeeServices.updateEmployee);
employeeRouter.put('/checkin/:dailyRecordId', employeeServices.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', employeeServices.updateCheckout);
employeeRouter.put('/employee/remark/:dailyRecordId', employeeServices.updateEmployeeRemark);

module.exports = employeeRouter;