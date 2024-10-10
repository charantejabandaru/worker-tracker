const express = require('express');
const siteAdminRouter = express.Router();
const siteAdminServices = require('../services/siteadmin');
const adminServices = require('../services/admin');
const dailyRecordService = require('../services/update-daily-record');

siteAdminRouter.get('/employee', adminServices.getEmployees);
siteAdminRouter.get('/employee/role/:role', adminServices.getEmployeeByRole);
siteAdminRouter.get('/employee/status/:status', adminServices.getEmployeeStatus);
siteAdminRouter.get('/sites/admin/:employeeId', adminServices.getSitesBySiteAdminId);
siteAdminRouter.get('/site/id/:siteId', adminServices.getSiteBySiteId);
siteAdminRouter.post('/dailyrecord', adminServices.addDailyRecord);
siteAdminRouter.put('/dailyrecord/:dailyRecordId', dailyRecordService.updateDailyRecord);
siteAdminRouter.get('/dailyrecord/lastassigned/:employeeId', adminServices.getLastAssignedWoryByEmployeeId);
siteAdminRouter.get('/dailyrecord/site/all/:siteId', siteAdminServices.getAllDailyRecordsBySite);
siteAdminRouter.get('/dailyrecord/site/now/:siteId', siteAdminServices.getTodayDailyRecordsBySite);
siteAdminRouter.post('/progressimage', progressUpload.array('photo', 12), adminServices.addProgressImage);
siteAdminRouter.get('/progressimage/:siteId', adminServices.getProgressBySite);
siteAdminRouter.put('/progressimage/:progressId', progressUpload.single('photo'), adminServices.updateProgressImage);
siteAdminRouter.delete('/progressimage/:progressId', adminServices.deleteProgressImage);
siteAdminRouter.get('/log', adminServices.getLogs);
siteAdminRouter.get('/log/operation/:operation', adminServices.getLogsByOperation);
siteAdminRouter.get('/log/modifier/:modifierId', adminServices.getLogsByModifierId);
siteAdminRouter.get('/log/date/:date', adminServices.getLogsByDate);

module.exports = siteAdminRouter;