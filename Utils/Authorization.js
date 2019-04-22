import jwt from 'jsonwebtoken';
import Keys from '../Config/Credintials/Keys';
const authorization = (request, requireAuth = true) => {
  const { authorization } = request.request.headers;
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, Keys.SecretOrKey);
    return decoded.id;
  }
  if (requireAuth) {
    throw new Error('Authentication Required');
  }
  return null;

}


export { authorization as default }