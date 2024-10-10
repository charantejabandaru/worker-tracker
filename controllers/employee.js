const express = require('express');
const employeeRouter = express.Router();
const employeeServices = require('../services/employee');
const uploadEmployeeProfile = require('../middlewares/employee-uploads');
const uploadRecord = require('../middlewares/record-uploads');
const isAuth = require('../middlewares/isAuth');

employeeRouter.post('/login', employeeServices.checkLogin);
employeeRouter.put('/employee/profile/:employeeId',uploadEmployeeProfile.single('photo'), employeeServices.updateProfileImage);
employeeRouter.delete('/employee/profile/:employeeId', employeeServices.deleteProfileImage);
employeeRouter.get('/employee/:employeeId', employeeServices.getEmployeeById);
employeeRouter.put('/employee/:employeeId', employeeServices.updateEmployeeById);
employeeRouter.put('/checkin/:dailyRecordId', uploadRecord.single('photo'), employeeServices.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', employeeServices.updateCheckout);
employeeRouter.put('/employee/remark/:dailyRecordId', employeeServices.updateEmployeeRemark);
employeeRouter.put('/employee/workstatus/:dailyRecordId', employeeServices.updateWorkStatus);
employeeRouter.get('/dailyrecord/employee/all/:employeeId', employeeServices.getAllDailyRecordsByEmployeeId);
employeeRouter.get('/dailyrecord/employee/now/:employeeId', employeeServices.getTodayDailyRecordsByEmployeeId);

module.exports = employeeRouter;
