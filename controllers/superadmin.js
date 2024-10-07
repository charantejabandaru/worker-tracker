//put('/employee/:employeeId')
//get('/employee/role/:role')
//get('/employee/specification/:specification')
//get('/employee-status/:status')
//put('/site/:siteId')

const { Router } = require('express');
const superAdminServices = require('../services/superadmin');
const router = Router({ strict: true });

router.post('/register', superAdminServices.register);
router.get('/employee', superAdminServices.getEmployees);
router.delete('/employee/:employeeId', superAdminServices.removeEmployee);
router.post('/site', superAdminServices.addSite);
router.get('/site', superAdminServices.getSites);
router.get('/site/id/:siteId', superAdminServices.getSiteById);
router.get('/site/location/:location', superAdminServices.getSiteByLocation);
router.delete('/site/:siteId', superAdminServices.removeSite);
router.post('/dailyrecord', superAdminServices.addDailyRecord);
router.delete('/dailyrecord/:dailyRecordId', superAdminServices.removeDailyRecord);
router.get('/request', superAdminServices.getRequests);
router.delete('/request/:requestId', superAdminServices.deleteRequest);

module.exports = router;