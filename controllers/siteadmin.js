
//get('/site/employee/:employeeId')
//get('/site/id/:siteId') ????
//get('/site/dailyRecord/:siteId')
//post('/request')
//put('/siteadmin/remark/:dailyRecordId')
//put('/workstatus/:dailyRecordId')
//put('/assignwork/:dailyRecordId')
//put('/progress/:siteId')

const express = require('express');
const siteAdminRouter = express.Router();
const siteAdminServices = require('../services/siteadmin');
const adminServices = require('../services/admin');


siteAdminRouter.get('/sites/admin/:employeeId', adminServices.getSitesBySiteAdminId);
siteAdminRouter.get('/site/id/:siteId', adminServices.getSiteBySiteId);
siteAdminRouter.get('/site/dailyRecord/:siteId', siteAdminService.getDailyRecordsBySiteId);
// siteAdminRouter.post('/request', siteAdminService.createRequest);
siteAdminRouter.put('/siteadmin/remark/:dailyRecordId', adminServices.updateRemark);
siteAdminRouter.put('/workstatus/:dailyRecordId', adminServices.updateWorkStatus);
// siteAdminRouter.put('/assignwork/:dailyRecordId', siteAdminService.updateWorkAssigned);
// siteAdminRouter.put('/progress/:siteId', siteAdminService.updateProgress);
siteAdminRouter.get('/dailyrecord/lastassigned/:employeeId', adminServices.getLastAssignedWoryByEmployeeId);
siteAdminRouter.get('/dailyrecord/site/all/:siteId', siteAdminServices.getAllDailyRecordsBySite);
siteAdminRouter.get('/dailyrecord/site/now/:siteId', siteAdminServices.getTodayDailyRecordsBySite);

module.exports = siteAdminRouter;

//This are common for super admin and site admin
//
//get('/employee') 1
//get('/employee/role/:role') 1
//get('/employee/status/:status') 1
//get('/dailyrecord/lastassigned/:employeeId') 1
//post('/dailyrecord') 1
//put('/dailyrecord/work/:dailyRecordId')
//get('/site/id/:siteId') 1
//put('/siteadmin/remark/:dailyRecordId') 1
//get('/progressimage/:siteId')--
//put('/progressimage/:progressId')--
//delete('/progressimage/:progressId')--
//post('/progressimage')--
//get('/sites/admin/:employeeId') 1
//get('/dailyrecord/site/now/:siteId')
//get('/dailyrecord/site/all/:siteId')

//Common for all users
//
//put('/workstatus/:dailyRecordId')
