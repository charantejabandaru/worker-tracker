const { Router } = require('express');
const superAdminServices = require('../services/superadmin');
const router = Router({ strict: true });

router.post('/register', superAdminServices.register);
router.get('/employee', superAdminServices.getEmployees);
router.get('/employee/role/:role', superAdminServices.getEmployeeByRole);
router.get('/employee/specification/:specification', superAdminServices.getEmployeeBySpecification);
router.get('/employee-status/:status', superAdminServices.getEmployeeStatus);
router.put('/employee/:employeeId', superAdminServices.updateEmployee);
router.delete('/employee/:employeeId', superAdminServices.removeEmployee);
router.post('/site', superAdminServices.addSite);
router.get('/site', superAdminServices.getSites);
router.get('/site/id/:siteId', superAdminServices.getSiteById);
router.get('/site/location/:location', superAdminServices.getSiteByLocation);
router.put('/site/:siteId', superAdminServices.updateSite);
router.delete('/site/:siteId', superAdminServices.removeSite);
router.post('/dailyrecord', superAdminServices.addDailyRecord);
router.delete('/dailyrecord/:dailyRecordId', superAdminServices.removeDailyRecord);
router.get('/request', superAdminServices.getRequests);
router.delete('/request/:requestId', superAdminServices.deleteRequest);

module.exports = router;