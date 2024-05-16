import { chatModel } from '../models/chat.model.js';
import { emitEvent } from '../utils/emit-event-utils.js';
import { ALERT, REFETCH_CHATS } from '../constants/events.js';
import { getOtherMembers } from '../utils/helper.js';

export const newGroupChat = async (req, res) => {
  try {
    let { name, members } = req.body;


    if (members.length < 2) return res.status(400).json({ status: false, message: 'Group chat must have atleast 3 members' });

    const allMembers = [...members, req.user];

    let groupChats = await chatModel.create({ name, groupChat: true, creater: req.user, members: allMembers });

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group chat`);
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
      status: true,
      message: 'Group chat created successfully',
      data: groupChats
    })

  } catch (error) {
    console.log(`Error creating group chat : ${error}`);
  }
}


export const getMyChats = async (req, res, next) => {
  try {
    const chats = await chatModel.find({ members: req.user }).populate("members", "name email avatar");

    const transformedChats = chats.map(chat => {

      const otherMember = getOtherMembers(chat.members, req.user);
      console.log('', chat.members)
      return {
        _id: chat._id,
        name: chat.name,
        groupChat: chat.groupChat,
        creater: chat.creater,
        avatar: chat.groupAvatar ? chat.members.slice(0, 3).map(({ avatar }) => avatar.url) : [otherMember.avatar.url],
        members: chat.members.map(member => {
          return {
            _id: member._id,
            name: member.name,
            email: member.email,
            avatar: member.avatar
          }
        }),
        lastMessage: chat.lastMessage,
      }
    })

    return res.status(200).json({
      status: true,
      message: 'Data fetched successfully',
      data: transformedChats
    });


  } catch (error) {
    console.log(`Error getting my chat : ${error}`);
  }
}

export const getMyGroups = async (req, res) => {
  try {
    const chats = await chatModel.find({
      members: req.user,
      groupChat: true,
      creator: req.user
    }).populate("members", "name avatar");

    const groups = chats.map(({ members, _id, groupChat, name }) => ({
      _id, groupChat, name, avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }))


    return res.status(200).json({
      status: true,
      message: 'Data fetched successfully',
      data: groups
    });

  } catch (error) {
    console.log(`Error getting my groups : ${error}`);
  }
}

export const addMembers = async (req, res) => {
  try {
    const { chatId, members } = req.body;

    if (!members || members.length < 1) return res.status(404).json({ status: 400, message: 'Please provide members' });

    const chat = await chatModel.findById(chatId);


    if (!chat) return res.status(404).json({ status: false, message: 'Chat Not Found' });

    if (!chat.groupChat) return res.status(400).json({
      status: false, message: 'This is not a group chat'
    });

    if (chat.creator.toString() !== req.user.toString()) return res.status(403).json({ status: false, message: 'You are not allowed to members' });


    const allNewMemberPromise = members.map((i) => UserModel.findById(i, "name"));

    const allNewMembers = await Promise.all(allNewMemberPromise);

    const uniqueMembers = allNewMembers.filter((i) => !chat.members.includes(i._id.toString()));

    chat.members.push(...uniqueMembers);

    if (chat.members.length > 10) {
      return res.status(400).json({ status: false, message: 'Group members limit reached' });
    }

    await chat.save();

    const allUsersName = allNewMembers.map(i => i.name).join(', ');

    emitEvent(req, ALERT, chat.members, `${chat.name} joined ${req.user.name} group chat`);

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({ success: true, groups, message: "Members added successfully" });

  } catch (error) {
    console.log(`Error while adding members: ${error}`);
  }
}


export const removeMember = async (req, res) => {
  try {
    const { userId, chatId } = req.body;

    const [chat, userThatWillBeRemoved] = await Promise.all([
      chatModel.findById(chatId),
      UserModel.findById(userId)
    ]);

    if (!chat) {
      return res.status(404).json({ status: false, message: 'Chat Not Found' });
    }

    if (!chat.groupChat) {
      return res.status(400).json({ status: false, message: 'This is not a group chat' });
    }

    if (chat.creator.toString() !== req.user.toString()) return res.status(403).json({ status: false, message: 'You are not allowed to members' });

    if (chat.members.length <= 3) {
      return res.status(400).json({ status: false, message: 'Group must have atleast 3 members' });
    }

    chat.members = chat.members.filter((member) => member.toString() !== userId.toString());

    await chat.save();

    emitEvent(req, ALERT, chat.members, `${userThatWillBeRemoved.name} has been removed from the group`);

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({ success: true, message: "Member removed successfully" });

  } catch (error) {
    console.log(`Error while removing members: ${error}`);
  }
}


export const leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await chatModel.findById(id);

    if (!chat) {
      return res.status(404).json({ status: false, message: 'Chat Not Found' });
    }

    if (!chat.groupChat) {
      return res.status(400).json({ status: false, message: 'This is not a group chat' });
    }

    const remainingMembers = chat.members.filter((member) => member.toString() !== req.user.toString());

    if (remainingMembers.length < 3) return res.status(400).json({ status: false, message: 'Group must have at least 3 members' });

    if (chat.creator.toString() === req.user.toString()) {

      const randomElement = Math.floor(Math.random() * remainingMembers.length);

      const newCreator = remainingMembers[randomElement];

      chat.creator = newCreator;
    }

    chat.members = remainingMembers;
    const user = await chatModel.findById(req.user, 'name');

    await chat.save();

    emitEvent(req, ALERT, chat.members, `User ${user.name} has left from the group`);

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({ success: true, message: "User Leaved successfully" });

  } catch (error) {
    console.log(`Error while removing members: ${error}`);
  }
}
