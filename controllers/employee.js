const express = require('express');
const employeeRouter = express.Router();
const employeeServices = require('../services/employee');
const uploadEmployeeProfile = require('../middlewares/employee-uploads');
const uploadRecord = require('../middlewares/record-uploads');
const isAuth = require('../middlewares/isAuth');

employeeRouter.post('/login', employeeServices.checkLogin);
employeeRouter.put('/employee/profile/:employeeId',uploadEmployeeProfile.single('photo'), employeeServices.updateProfileImage);
employeeRouter.get('/employee/:employeeId', employeeServices.getEmployeeById);
employeeRouter.put('/employee/:employeeId', isAuth(['superAdmin', 'technician']), employeeServices.updateEmployeeById);
employeeRouter.get('/employee/dailyRecord/:employeeId', employeeServices.getTasksById);
employeeRouter.put('/checkin/:dailyRecordId', uploadRecord.single('photo'), employeeServices.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', employeeServices.updateCheckout);
employeeRouter.put('/employee/remark/:dailyRecordId', employeeServices.updateEmployeeRemark);

module.exports = employeeRouter;

//Common for all users
//
//put('/workstatus/:dailyRecordId') 1