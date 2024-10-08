const express = require('express');
const employeeRouter = express.Router();
const employeeServices = require('../services/employee');
const isAuth = require('../middlewares/isAuth');

employeeRouter.post('/login', employeeServices.checkLogin);
employeeRouter.get('/employee/:employeeId', employeeServices.getEmployeeById);
employeeRouter.put('/employee/:employeeId', isAuth(['superAdmin', 'technician']), employeeServices.updateEmployeeById);
employeeRouter.get('/employee/dailyRecord/:employeeId', employeeServices.getTasksById);
employeeRouter.put('/checkin/:dailyRecordId', employeeServices.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', employeeServices.updateCheckout);
employeeRouter.put('/employee/remark/:dailyRecordId', employeeServices.updateEmployeeRemark);

module.exports = employeeRouter;


//post('/login') 1
//get('/employee/:employeeId') 1
//put('/employee/:employeeId') 1
//put('/checkin/:dailyRecordId') 1
//put('/checkout/:dailyRecordId') 1
//get('/employee/dailyrecord/:employeeId') 1
//put('/employee/remark/:dailyRecordId') 1

//Common for all users
//
//put('/workstatus/:dailyRecordId') 1