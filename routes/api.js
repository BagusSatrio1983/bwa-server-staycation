const router = require('express').Router();
const apiController = require('../controllers/apiController');
const {uploadSingle} = require('../middlewares/multer');

const adminController = require('../controllers/adminController');
// start signin
router.get('/landing-page', apiController.landingPage);
router.get('/detail-page/:id', apiController.detailPage);
// end signin

// stat booking page
router.post('/booking-page', uploadSingle, apiController.bookingPage);
// end booking page


module.exports = router;