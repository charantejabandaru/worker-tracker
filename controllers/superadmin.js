//post('/register')
//get('/employee')
//put('/employee/:employeeId')
//post('/site')
//get('/site')
//get('/site/location/:location')
//get('/site/id/:siteId')
//get('/employee/role/:role')
//get('/employee/specification/:specification')
//get('/request')
//delete('/request/:requestId')
//get('/employee-status/:status')
//post('/assignsite/:siteId/:employeeId')
//delete('/employee/:employeeId')
//put('/site/:siteId')
//delete('/site/:siteId')
//delete('/dailyrecord/:dailyRecordId')
//post('/register')

const { Router } = require('express');
const superAdminServices = require('../services/superadmin');
const router = Router({ strict: true });

router.post('/register', superAdminServices.register);
//router.get('/employees', superAdminServices.getEmployees);
//router.put('/employee/:employeeId', superAdminServices.updateEmployee);
router.post('/site', superAdminServices.addSite);
router.post('/assignsite/:siteId/:employeeId', superAdminServices.addDailyRecord);

module.exports = router;