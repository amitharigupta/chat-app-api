import express from 'express';
var router = express.Router();
import { loginController, registerController, myProfileController, myLogoutController, searchController, allUserController, sendFriendRequestController, acceptFriendRequestController, getAllNotificationsController } from '../controllers/UserController.js';
import { singleFileUpload } from '../middlewares/multer.js';
import isAuthenticated from '../middlewares/auth.js';

import { registrationSchema, loginSchema, friendReuestSchema, acceptfriendReuestSchema } from '../validations/validator.js';
import schemaValidator from '../middlewares/schemaValidator.js';

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', schemaValidator(loginSchema), loginController);
router.post('/register', singleFileUpload, schemaValidator(registrationSchema), registerController);


// Authenticated users routes
router.get('/myprofile', isAuthenticated, myProfileController);
router.get('/logout', isAuthenticated, myLogoutController);
router.get('/search', isAuthenticated, searchController);
router.get('/all', isAuthenticated, allUserController);

router.put('/sendrequest', schemaValidator(friendReuestSchema), isAuthenticated, sendFriendRequestController);
router.put('/acceptrequest', schemaValidator(acceptfriendReuestSchema), isAuthenticated, acceptFriendRequestController);
router.get('/notifications', isAuthenticated, getAllNotificationsController);

export default router;
