import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
  if (password.length < 8) {
    throw new Error('Password must be atlease 8 characters long')
  }
  return bcrypt.hash(password, 12);
};

export { hashPassword };