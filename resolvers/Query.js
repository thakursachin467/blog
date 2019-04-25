import authorization from '../Utils/Authorization';
const Query = {
  posts(parent, args, { database, request }, info) {
    let filter = {
      first: args.limit,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        Published: true
      }
    }
    if (args.query) {
      filter = {
        first: args.first,
        skip: args.skip,
        after: args.after,
        orderBy: args.orderBy,
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
    let filter = {
      first: args.limit,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where:
        { author: { id: userId } }
    };
    if (args.query) {
      filter = {
        first: args.limit,
        skip: args.skip,
        after: args.after,
        orderBy: args.orderBy,
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
        first: args.limit,
        skip: args.skip,
        after: args.after,
        orderBy: args.orderBy,
        where: {
          OR: [{
            firstName_contains: args.query
          }, {
            lastName_contains: args.query
          }]
        }
      }
    }
    return database.query.users(filter, info);

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
    return database.query.comments({
      first: args.limit,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    }, info);
  }
}


export { Query as default }