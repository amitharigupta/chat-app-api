import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;
const tokenExpiry = process.env.TOKEN_EXPIRY;

const createToken = async (payload) => {
  try {
    let token = await jwt.sign(payload, secretKey, { expiresIn: tokenExpiry });
    return token;
  } catch (error) {
    console.log(`Error while generating token`);
  }
}


const verifyToken = async (token) => {
  try {
    const isVerified = await jwt.verify(token, secretKey);
    return isVerified;
  } catch (error) {
    console.log(`Errorw while verifying token`);
  }
}

export default { createToken, verifyToken }
