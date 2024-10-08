const { Router } = require('express');
const superAdminServices = require('../services/superadmin');
const router = Router({ strict: true });

// router.post('/register', superAdminServices.register);
// router.get('/employee', superAdminServices.getEmployees);
// router.get('/employee/role/:role', superAdminServices.getEmployeeByRole);
// router.get('/employee/specification/:specification', superAdminServices.getEmployeeBySpecification);
// router.get('/employee-status/:status', superAdminServices.getEmployeeStatus);
// router.delete('/employee/:employeeId', superAdminServices.removeEmployee);
// router.post('/site', superAdminServices.addSite);
// router.get('/site', superAdminServices.getSites);
// router.get('/site/id/:siteId', superAdminServices.getSiteById);
// router.get('/site/location/:location', superAdminServices.getSiteByLocation);
// router.put('/site/:siteId', superAdminServices.updateSite);
// router.delete('/site/:siteId', superAdminServices.removeSite);
// router.post('/dailyrecord', superAdminServices.addDailyRecord);
// router.delete('/dailyrecord/:dailyRecordId', superAdminServices.removeDailyRecord);
// router.get('/request', superAdminServices.getRequests);
// router.delete('/request/:requestId', superAdminServices.deleteRequest);

module.exports = router;

//post('/register')
//post('/sites')
//get('/sites')
//put('/siteadmin/add/:siteId')
//put('/siteadmin/delete/:siteId')
//delete('/employee/:employeeId')
//delete('/site/:siteId')
//get('/site/location/:location')
//put('/site/:siteId')


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
