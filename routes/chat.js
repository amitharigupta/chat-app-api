import express from 'express';
var router = express.Router();
import isAuthenticated from '../middlewares/auth.js';
import { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages } from '../controllers/ChatController.js';
import { attachmentsMulter } from '../middlewares/multer.js';


import { newGroupChatValidator, addMemberValidator, removeMemberValidator, leaveGroupValidator, sendAttachmentValidator, getMessageValidator } from '../validations/validator.js';
import schemaValidator from '../middlewares/schemaValidator.js';

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('chat respond with a resource');
});


router.use(isAuthenticated);

router.post('/new', schemaValidator(newGroupChatValidator), newGroupChat);

router.get('/mychat', getMyChats);

router.get('/groups', getMyGroups);

router.put('/addmembers', schemaValidator(addMemberValidator), addMembers);

router.put('/removemember', schemaValidator(removeMemberValidator), removeMember);

router.delete('/leave/:id', schemaValidator(leaveGroupValidator), leaveGroup);

router.post('/message', attachmentsMulter, schemaValidator(sendAttachmentValidator), sendAttachments);

router.get('/:id', getChatDetails);
router.put('/:id', renameGroup);
router.delete('/:id', deleteChat);

router.get('/message/:id', schemaValidator(getMessageValidator), getMessages);

export default router;
