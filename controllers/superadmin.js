const { Router } = require('express');
const superAdminServices = require('../services/superadmin');
const adminServices = require('../services/admin');
const router = Router({ strict: true });

router.post('/register', superAdminServices.register);
router.get('/employee', adminServices.getEmployees);
router.get('/employee/role/:role', adminServices.getEmployeeByRole);
// router.get('/employee/specification/:specification', superAdminServices.getEmployeeBySpecification);
router.get('/employee/:status', adminServices.getEmployeeStatus);
router.delete('/employee/:employeeId', superAdminServices.removeEmployee);
router.post('/sites', superAdminServices.addSite);
router.get('/sites', superAdminServices.getSites);
router.get('/site/id/:siteId', adminServices.getSiteBySiteId);
// router.get('/site/location/:location', superAdminServices.getSiteByLocation);
router.put('/site/:siteId', superAdminServices.updateSite);
router.delete('/site/:siteId', superAdminServices.removeSite);
router.post('/dailyrecord', adminServices.addDailyRecord);
// router.delete('/dailyrecord/:dailyRecordId', superAdminServices.removeDailyRecord);
// router.get('/request', superAdminServices.getRequests);
// router.delete('/request/:requestId', superAdminServices.deleteRequest);

module.exports = router;

//post('/register') 1
//post('/sites') 1
//get('/sites') 1
//put('/siteadmin/add/:siteId') --
//put('/siteadmin/delete/:siteId') --
//delete('/employee/:employeeId') 1
//delete('/site/:siteId') 1
//get('/site/location/:location') --
//put('/site/:siteId') 1


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
