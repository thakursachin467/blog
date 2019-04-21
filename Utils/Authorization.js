import jwt from 'jsonwebtoken';
import Keys from '../Config/Credintials/Keys';
const authorization = (request) => {
  const { authorization } = request.request.headers;
  if (!authorization) {
    throw new Error('Authentication Required');
  }
  const token = authorization.replace('Bearer ', '');
  const decoded = jwt.verify(token, Keys.SecretOrKey);
  return decoded.id;
}


export { authorization as default }