import bcrypt from 'bcryptjs';

let Keys = process.env || require('../Config/Credintials/Keys');

const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be atlease 8 characters long')
  }
  return bcrypt.hash(password, 12);
};

export { hashPassword };