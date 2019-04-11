const Query = {
  posts(parent, args, { database }, info) {
    return database.query.posts(null, info);
    //  if (!args.query) {
    //    return db.posts;
    //  }
    //  const filter = args.query.toLowerCase();
    //  return db.posts.filter(post => {
    //    return post.title.toLowerCase().includes(filter) || post.body.toLowerCase().includes(filter);
    //  });
  },
  users(parent, args, { database }, info) {
    return database.query.users(null, info);
    //  if (!args.query) {
    //    return users;
    //  }
    //  const filter = args.query.toLowerCase();
    //  return db.users.filter((user) => {
    //    return user.firstName.toLowerCase().includes(filter)
    //  });

  },
  comments(parent, args, { database }, info) {
    return database.query.comments(null, info);
  }
}


export { Query as default }