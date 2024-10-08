
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
const siteAdminService = require('../services/siteadmin');

// siteAdminRouter.get('/site/employee/:employeeId', siteAdminService.getSitesBySiteAdminId);
// siteAdminRouter.get('/site/id/:siteId', siteAdminService.getSiteBySiteId);
// siteAdminRouter.get('/site/dailyRecord/:siteId', siteAdminService.getDailyRecordsBySiteId);
// siteAdminRouter.post('/request', siteAdminService.createRequest);
// siteAdminRouter.put('/siteadmin/remark/:dailyRecordId', siteAdminService.updateRemark);
// siteAdminRouter.put('/workstatus/:dailyRecordId', siteAdminService.updateWorkStatus);
// siteAdminRouter.put('/assignwork/:dailyRecordId', siteAdminService.updateWorkAssigned);
// siteAdminRouter.put('/progress/:siteId', siteAdminService.updateProgress);

module.exports = siteAdminRouter;

//get('/dailyrecord/site/:siteId');


//This are common for super admin and site admin
//
//get('/employee')
//get('/employee/role/:role')
//get('/employee/status/:status')
//get('/dailyrecord/lastassigned/:employeeId')
//post('/dailyrecord')
//put('/dailyrecord/work/:dailyRecordId')
//get('/site/id/:siteId')
//put('/siteadmin/remark/:dailyRecordId')
//get('/progressimage/:siteId')
//put('/progressimage/:progressId')
//delete('/progressimage/:progressId')
//post('/progressimage')
//get('/sites/admin/:employeeId')

//Common for all users
//
//put('/workstatus/:dailyRecordId')
