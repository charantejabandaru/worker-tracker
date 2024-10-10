const express = require('express');
const employeeRouter = express.Router();
const employeeServices = require('../services/employee');
const uploadEmployeeProfile = require('../middlewares/employee-uploads');
const uploadRecord = require('../middlewares/record-uploads');
const isAuth = require('../middlewares/isAuth');
const allowRoles = ["technician", "siteAdmin", "superAdmin"];

employeeRouter.post('/login', employeeServices.checkLogin);
employeeRouter.put('/employee/profile/:employeeId', isAuth(allowRoles), uploadEmployeeProfile.single('photo'), employeeServices.updateProfileImage);
employeeRouter.delete('/employee/profile/:employeeId', isAuth(allowRoles), employeeServices.deleteProfileImage);
employeeRouter.get('/employee/:employeeId', isAuth(allowRoles), employeeServices.getEmployeeById);
employeeRouter.put('/employee/:employeeId', isAuth(allowRoles), employeeServices.updateEmployeeById);
employeeRouter.put('/checkin/:dailyRecordId', isAuth(allowRoles), uploadRecord.single('photo'), employeeServices.updateCheckin);
employeeRouter.put('/checkout/:dailyRecordId', isAuth(allowRoles), employeeServices.updateCheckout);
employeeRouter.put('/employee/remark/:dailyRecordId', isAuth(allowRoles), employeeServices.updateEmployeeRemark);
employeeRouter.put('/employee/workstatus/:dailyRecordId', isAuth(allowRoles), employeeServices.updateWorkStatus);
employeeRouter.get('/dailyrecord/employee/all/:employeeId', isAuth(allowRoles), employeeServices.getAllDailyRecordsByEmployeeId);
employeeRouter.get('/dailyrecord/employee/now/:employeeId', isAuth(allowRoles), employeeServices.getTodayDailyRecordsByEmployeeId);

module.exports = employeeRouter;
