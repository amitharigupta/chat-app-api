import userModel from '../models/user.model.js';
import { chatModel } from '../models/chat.model.js';
import { requestModel } from '../models/request.model.js';
import PasswordUtils from '../utils/password-utils.js';
import JWTUtils from '../utils/jwt-utils.js';
import responseUtils from '../utils/response-utils.js';
import { NEW_FRIEND_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { emitEvent } from '../utils/emit-event-utils.js';

export const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: false, message: "Invalid user / password" });
    }

    const isMatchPassword = await PasswordUtils.comparePassword(password, user.password);

    console.log('isMatchPassword : ', isMatchPassword);
    if (!isMatchPassword) {
      return res.status(404).json(responseUtils.error("Invalid user / password"));
    }

    let token = await JWTUtils.createToken({ id: user._id, email: user.email });

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      // sameSite: 'none'
    }

    return res.status(201).cookie('authToken', token, cookieOptions).json({
      status: true,
      message: "Login Success",
      data: {
        user: user,
        token: 'Bearer', token
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};


export const registerController = async (req, res) => {
  try {

    const avatar = {
      public_id: 'akdjdkjadnjan',
      url: 'dkjndajndnjkandanw'
    }
    const hashPassword = await PasswordUtils.hashPassword(req.body.password);

    const userPayload = { name: req.body.name, avatar: avatar, email: req.body.email, password: hashPassword, phone: req.body.phone }

    const userExist = await userModel.findOne({ email: userPayload.email });

    if (userExist) {
      return res.status(400).json({ status: false, message: "User Already Exist" });
    }

    const user = await userModel.create(userPayload);

    return res.status(201).json({
      status: true,
      message: "Register Success",
      data: user
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};


export const myProfileController = async (req, res) => {
  try {

    console.log('req.params.id : ', req.user);
    const id = req.user
    const user = await userModel.findById(id);

    if (!user) return res.status(404).json({
      status: false,
      message: "User Not Found"
    })

    return res.status(200).json({
      status: true,
      message: "Get Profile Success",
      data: user
    });
  } catch (error) {
    console.log(`Error while getting profile: ${error}`);
  }
}


export const myLogoutController = async (req, res) => {
  try {
    return res.status(200).cookie('authToken', '').json({ status: true, message: 'Logged out successfully' });
  } catch (error) {
    console.log(`Error while logging out : ${error}`);
  }
}

export const searchController = async (req, res) => {
  try {
    const { name = "" } = req.query;

    const myChats = await chatModel.find({ groupChat: false, members: req.user });

    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    const allUsersExceptMeAndFriends = await userModel.find({
      _id: { $nin: allUsersFromMyChats },
      name: { $regex: name, $options: "i" }
    });

    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url
    }))

    // const user = await userModel.find({ groupChat: false });
    // if (!user) return res.status(404).json({ status: false, message: "User Not Found" });

    return res.status(200).json({ status: true, message: "Data fetched successfully", data: users });
  } catch (error) {
    console.log(`Error while searching : ${error}`);
  }
}


export const sendFriendRequestController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ status: false, message: "Please enter valid request" });

    const request = await requestModel.findOne({
      $or: [
        { sender: req.user, reciever: userId },
        { sender: userId, reciever: req.user }
      ]
    });

    if (request) {
      return res.status(400).json({ status: false, message: "Request already sent" });
    }

    console.log('', req.user, userId)
    let friendReuest = await requestModel.create({ sender: req.user, reciever: userId });


    emitEvent(req, NEW_FRIEND_REQUEST, [userId], "request");
    return res.status(200).json({
      status: true, message: 'Friend Request created successfully', data: friendReuest
    });

  } catch (error) {
    console.log(`Error while sending friend request : ${error}`);
    return res.status(500).json({ status: false, message: `Error while sending friend request : ${error}` });
  }
};

export const acceptFriendRequestController = async (req, res) => {
  try {
    const { requestId, isAccept } = req.body;

    if (!userId) return res.status(400).json({ status: false, message: "Please enter valid request" });

    const request = await requestModel.findById(requestId).populate("sender", "name").populate("reciever", "name");

    if (!request) {
      return res.status(404).json({ status: false, message: "Request not found" });
    }

    if (request.reciever.toString() !== req.user.toString())
      return res.status(401).json({
        status: false, message: "You are not authorized to access this request."
      });

    if (!isAccept) {
      await requestModel.deleteOne();
      return res.status(200).json({ status: true, message: "Friend Request Rejected" });
    }

    const members = [request.sender._id, request.reciever._id];

    let p1 = chatModel.create({ members, name: `${request.sender.name}-${request.reciever.name}` });

    let p2 = requestModel.deleteOne();

    await Promise.all([p1, p2]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      status: true, message: 'Friend Request Accepted', data: { senderId: request.sender._id }
    });
  } catch (error) {
    console.log(`Error while sending friend request : ${error}`);
    return res.status(500).json({ status: false, message: `Error while accepting friend request : ${error}` });
  }
};

export const getAllNotificationsController = async (req, res) => {
  try {
    const requests = await requestModel.find({ reciever: req.user }).populate("sender", "name avatar");

    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url
      }
    }));

    return res.status(200).json({ status: true, message: "Data fetched successfully", data: allRequests });

  } catch (error) {
    console.log(`Error while getting all notifications : ${error}`);
    return res.status(500).json({ status: false, message: `Error while getting all notifications : ${error}` });
  }
}

export const allUserController = async (req, res) => {
  try {
    const users = await userModel.find({});

    return res.status(200).json({ status: true, message: "Data fetched successfully", data: users });

  } catch (error) {
    console.log(`Error while searching all users ${error} `);
  }
}
