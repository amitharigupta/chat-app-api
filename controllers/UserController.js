import userModel from '../models/user.model.js';
import PasswordUtils from '../utils/password-utils.js';
import JWTUtils from '../utils/jwt-utils.js';
import responseUtils from '../utils/response-utils.js';

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
    const { name } = req.query;
    const user = await userModel.findOne({ name });
    if (!user) return res.status(404).json({ status: false, message: "User Not Found" });

    return res.status(200).json({ status: true, message: "Data fetched successfully", data: "user" });
  } catch (error) {
    console.log(`Error while searching : ${error}`);
  }
}


export const allUserController = async (req, res) => {
  try {
    const users = await userModel.find({});

    return res.status(200).json({ status: true, message: "Data fetched successfully", data: users });

  } catch (error) {
    console.log(`Error while searching all users ${error}`);
  }
}
