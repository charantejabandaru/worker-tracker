const { Router } = require('express');
const superAdminServices = require('../services/superadmin');
const adminServices = require('../services/admin');
const dailyRecordService = require('../services/update-daily-record');
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
router.get('/sites/admin/:employeeId', adminServices.getSitesBySiteAdminId);
router.get('/site/location/:location', superAdminServices.getSiteByLocation);
router.put('/site/:siteId', superAdminServices.updateSiteBasicInfo);
router.put('/siteadmin/add/:siteId', superAdminServices.addSiteAdminsIntoSite);
router.put('/siteadmin/delete/:siteId', superAdminServices.deleteSiteAdminsIntoSite);
router.delete('/site/:siteId', superAdminServices.removeSite);
router.post('/dailyrecord', adminServices.addDailyRecord);
router.get('/dailyrecord/all', superAdminServices.getAllDailyRecords);
router.get('/dailyrecord/now', superAdminServices.getTodayDailyRecords);
router.get('/dailyrecord/lastassigned/:employeeId', adminServices.getLastAssignedWoryByEmployeeId);
router.put('/dailyrecord/:dailyrecordId', dailyRecordService.updateDailyRecord);
router.delete('/dailyrecord/:dailyRecordId', superAdminServices.removeDailyRecord);
router.post('/progressimage', progressUpload.array('photo', 12), adminServices.addProgressImage);
router.get('/progressimage/:siteId', adminServices.getProgressBySite);
router.put('/progressimage/:progressId', progressUpload.single('photo'), adminServices.updateProgressImage);
router.delete('/progressimage/:progressId', adminServices.deleteProgressImage);
router.get('/log', adminServices.getLogs);
router.get('/log/operation/:operation', adminServices.getLogsByOperation);
router.get('/log/modifier/:modifierId', adminServices.getLogsByModifierId);
router.get('/log/date/:date', adminServices.getLogsByDate);

module.exports = router;