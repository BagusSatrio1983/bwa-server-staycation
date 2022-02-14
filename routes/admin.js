const router = require('express').Router();
const auth = require('../middlewares/auth');
const {uploadSingle, uploadMultiple} = require('../middlewares/multer');

const adminController = require('../controllers/adminController');
// start Signin
router.get('/signin', adminController.viewSignIn);
router.post('/signin', adminController.actionSignIn);
// end Signin

// start signup
router.get('/signup', adminController.viewSignUp);
router.post('/signup', adminController.signUp);
// end signup

// auth
router.use(auth);
router.get('/logout', adminController.actionLogOut);

// start dashboard
// read
router.get('/dashboard', adminController.viewDashboard);
// end dashboard

// start category
// create
router.post('/category', adminController.addCategory);
// read
router.get('/category', adminController.viewCategory);
// update
router.put('/category', adminController.editCategory);
// delete
router.delete('/category/:id', adminController.deleteCategory);
// end category

// start bank
// create
router.post('/bank', uploadSingle, adminController.addBank);
// read
router.get('/bank', adminController.viewBank);
// update
router.put('/bank',uploadSingle, adminController.editBank);
// delete
router.delete('/bank/:id', adminController.deleteBank);

// end bank

// start item
// create
router.post('/item', uploadMultiple, adminController.addItem);
// read
router.get('/item', adminController.viewItem);
router.get('/item/:id', adminController.showEditItem);
router.get('/item/show-image/:id', adminController.showImageItem);
// update
router.put('/item/:id', uploadMultiple, adminController.editItem);
// delete
router.delete('/item/:id/delete', adminController.deleteItem);

// view detail item
router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem);

// add feature
router.post('/item/add/feature', uploadSingle, adminController.addFeature);
// edit feature
router.put('/item/update/feature', uploadSingle, adminController.editFeature);
// delete feature
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature);

// add activity
router.post('/item/add/activity', uploadSingle, adminController.addActivity);
// edit activity
router.put('/item/update/activity', uploadSingle, adminController.editActivity);
// // delete activity
router.delete('/item/:itemId/activity/:id', adminController.deleteAvtivity);


// end item

// start booking
router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDetailBooking);
router.put('/booking/:id/confirmation', adminController.actionConfirmation);
router.put('/booking/:id/reject', adminController.actionReject);
// end booking

module.exports = router;