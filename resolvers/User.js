import authentication from '../Utils/Authorization';

const User = {
  posts: {
    fragment: 'fragment  userId on User {id}',
    resolve(parent, args, { database }, info) {
      return database.query.posts({
        where: {
          Published: true,
          author: {
            id: parent.id
          }
        }
      })
    }
  },
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