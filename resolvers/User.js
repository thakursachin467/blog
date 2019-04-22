import authentication from '../Utils/Authorization';
const User = {
  email: {
    fragment: 'fragment  userId on User {id}',
    resolve(parent, args, { request }, info) {
      const userId = authentication(request, false);
      if (userId && parent.id === userId) {
        return parent.email;
      } else {
        return null;
      }
    }
  }
}


export { User as default }