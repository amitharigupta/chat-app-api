import express from 'express';
var router = express.Router();
import isAuthenticated from '../middlewares/auth.js';
import { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat } from '../controllers/ChatController.js';
import { attachmentsMulter } from '../middlewares/multer.js';

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

router.post('/message', attachmentsMulter, sendAttachments);

router.get('/:id', getChatDetails);
router.put('/:id', renameGroup);
router.delete('/:id', deleteChat);

export default router;
