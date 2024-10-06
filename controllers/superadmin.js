//put('/employee/:employeeId')
//get('/site/location/:location')
//get('/site/id/:siteId')
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
//router.get('/employees', superAdminServices.getEmployees);
//router.put('/employee/:employeeId', superAdminServices.updateEmployee);
router.post('/site', superAdminServices.addSite);
router.get('/site', superAdminServices.getSites);
router.delete('/site/:siteId', superAdminServices.removeSite);
router.post('/dailyrecord', superAdminServices.addDailyRecord);
router.delete('/dailyrecord/:dailyRecordId', superAdminServices.removeDailyRecord);
router.get('/request', superAdminServices.getRequests);
router.delete('/request/:requestId', superAdminServices.deleteRequest);

module.exports = router;