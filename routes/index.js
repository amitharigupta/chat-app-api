import express from 'express';
import userApiRoute from './users.js';
import chatApiRoute from './chat.js';

const router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', userApiRoute);
router.use('/chat', chatApiRoute);

export default router;
