import jwt from 'jsonwebtoken';
import Keys from '../Config/Credintials/Keys';
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, Keys.SecretOrKey, { expiresIn: '7 days' });
};



export { generateToken }