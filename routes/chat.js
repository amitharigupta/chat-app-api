import express from 'express';
var router = express.Router();
import isAuthenticated from '../middlewares/auth.js';
import { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup } from '../controllers/ChatController.js';

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('chat respond with a resource');
});


router.use(isAuthenticated);

router.post('/new', newGroupChat);

router.get('/mychat', getMyChats);

router.get('/groups', getMyGroups);

router.put('/addmembers', addMembers);

router.put('/removemember', removeMember);

router.delete('/leave/:id', leaveGroup);



export default router;
