import bcrypt from 'bcrypt';

const saltsRounds = 10;

const hashPassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, saltsRounds);

    return hashPassword;
  } catch (error) {
    console.log('error:', error);
  }
}

export const comparePassword = async (password, hashPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashPassword);
    return isMatch;
  } catch (error) {
    console.log('error: ', error);
  }
}

export default {
  hashPassword,
  comparePassword
}

