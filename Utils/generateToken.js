import jwt from 'jsonwebtoken';
let Keys = process.env || require('../Config/Credintials/Keys');
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, Keys.SecretOrKey, { expiresIn: '7 days' });
};



export { generateToken }