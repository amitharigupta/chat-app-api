import express from 'express';
var router = express.Router();
import { loginController, registerController, myProfileController, myLogoutController, searchController } from '../controllers/UserController.js';
import { singleFileUpload } from '../middlewares/multer.js';
import isAuthenticated from '../middlewares/auth.js';

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', loginController);
router.post('/register', singleFileUpload, registerController);


// Authenticated users routes
router.get('/myprofile', isAuthenticated, myProfileController);
router.get('/logout', isAuthenticated, myLogoutController);
router.get('/search', isAuthenticated, searchController);

export default router;
