const { Router } = require('express');
const superAdminServices = require('../services/superadmin');
const adminServices = require('../services/admin');
const progressUpload = require('../middlewares/progress-uploads');
const router = Router({ strict: true });
const isAuth = require('../middlewares/isAuth');


router.post('/register', superAdminServices.register);
router.get('/employee', adminServices.getEmployees);
router.get('/employee/role/:role', adminServices.getEmployeeByRole);
router.get('/employee/status/:status', adminServices.getEmployeeStatus);
router.delete('/employee/:employeeId', superAdminServices.removeEmployee);
router.post('/site', superAdminServices.addSite);
router.get('/site', superAdminServices.getSites);
router.get('/site/id/:siteId', adminServices.getSiteBySiteId);
router.get('/site/location/:location', superAdminServices.getSiteByLocation);
router.delete('/site/:siteId', superAdminServices.removeSite);
router.post('/dailyrecord', adminServices.addDailyRecord);
router.get('/dailyrecord/all', superAdminServices.getAllDailyRecords);
router.get('/dailyrecord/now', superAdminServices.getTodayDailyRecords);
router.delete('/dailyrecord/:dailyRecordId', superAdminServices.removeDailyRecord);
router.post('/progressimage', progressUpload.array('photo', 12), adminServices.addProgressImage);
router.get('/progressimage/:siteId', adminServices.getProgressBySite);
router.put('/progressimage/:progressId', progressUpload.single('photo'), adminServices.updateProgressImage);
router.put('/site/:siteId', adminServices.updateSiteBasicInfo);
router.put('/siteadmin/add/:siteId', adminServices.addSiteAdminsIntoSite);
router.put('/siteadmin/delete/:siteId', adminServices.deleteSiteAdminsIntoSite);
module.exports = router;


//This are common for super admin and site admin
//
//put('/dailyrecord/:dailyRecordId')
//put('/siteadmin/remark/:dailyRecordId')
//delete('/progressimage/:progressId')
//get('/sites/admin/:employeeId')

//Common for all users
//
//put('/workstatus/:dailyRecordId')
