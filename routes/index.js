import express from 'express';
import userApiRoute from './users.js';

const router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', userApiRoute);

export default router;
