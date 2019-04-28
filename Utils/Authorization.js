import jwt from 'jsonwebtoken';
let Keys = process.env || require('../Config/Credintials/Keys');

const authorization = (request, requireAuth = true) => {
  const authorization = request.request ? request.request.headers.authorization : request.connection.context.Authorization;
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