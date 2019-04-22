import authorization from '../Utils/Authorization';
const Query = {
  posts(parent, args, { database, request }, info) {
    let filter = {
      where: {
        Published: true
      }
    }
    if (args.query) {
      filter = {
        where: {
          Published: true,
          OR: [{
            title_contains: args.query
          }, {
            body_contains: args.query
          }]
        }
      }
    }
    return database.query.posts(filter, info);
  },
  async myPost(parent, args, { database, request }, info) {
    const userId = authorization(request, true);
    let filter = { where: { author: { id: userId } } };
    if (args.query) {
      filter = {
        where: {
          author: { id: userId },
          OR: [{
            title_contains: args.query
          }, {
            body_contains: args.query
          }]
        }
      }
    }
    const posts = await database.query.posts(filter, info);
    if (posts.length === 0) {
      throw new Error('No posts Found');
    }
    return posts;

  },
  async post(parent, args, { database, request }, info) {
    const userId = authorization(request, false);
    const posts = await database.query.posts({
      where:
      {
        id: userId,
        OR: [{
          Published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info);
    if (posts.length === 0) {
      throw new Error('Something Went Wrong!')
    }
    return posts[0];
  },
  users(parent, args, { database, request }, info) {
    let filter = {}
    if (args.query) {
      filter = {
        where: {
          OR: [{
            name_contains: args.query
          }, {
            email_contains: args.query
          }]
        }
      }
    }
    return database.query.users(null, info);

  },
  async me(parent, args, { database, request }, info) {
    const userId = authorization(request, true);
    const user = await database.query.user({ where: { id: userId } }, info);
    if (!user) {
      throw new Error('No user found!');
    }
    return user;

  },
  comments(parent, args, { database, request }, info) {
    return database.query.comments(null, info);
  }
}


export { Query as default }