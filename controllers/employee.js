const express = require('express');
const employeeRouter = express.Router();
const employeeServices = require('../services/employee');
const uploadEmployeeProfile = require('../middlewares/employee-uploads');
const uploadRecord = require('../middlewares/record-uploads');

employeeRouter.post('/login', employeeServices.checkLogin);
employeeRouter.put('/employee/:employeeId', employeeServices.updateEmployee);
employeeRouter.put('/employee/profile/:employeeId',uploadEmployeeProfile.single('photo'), employeeServices.updateProfileImage);
// employeeRouter.get('/employee/:employeeId', employeeServices.getEmployeeById);
// employeeRouter.get('/employee/dailyRecord/:employeeId', employeeServices.getTasksById);
employeeRouter.put('/checkin/:dailyRecordId', uploadRecord.single('photo'), employeeServices.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', employeeServices.updateCheckout);
// employeeRouter.put('/employee/remark/:dailyRecordId', employeeServices.updateEmployeeRemark);
const isAuth = require('../middlewares/isAuth');

employeeRouter.post('/login', employeeServices.checkLogin);
employeeRouter.get('/employee/:employeeId', employeeServices.getEmployeeById);
employeeRouter.put('/employee/:employeeId', isAuth(['superAdmin', 'technician']), employeeServices.updateEmployeeById);
employeeRouter.get('/employee/dailyRecord/:employeeId', employeeServices.getTasksById);
employeeRouter.put('/checkin/:dailyRecordId', employeeServices.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', employeeServices.updateCheckout);
employeeRouter.put('/employee/remark/:dailyRecordId', employeeServices.updateEmployeeRemark);

module.exports = employeeRouter;


//get('/employee/:employeeId')
//put('/employee/:employeeId')
//put('/checkin/:dailyRecordId')
//put('/checkout/:dailyRecordId')
//get('/employee/dailyrecord/:employeeId')
//put('/employee/remark/:dailyRecordId')
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