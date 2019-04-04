const Query = {
  me() {
    return {
      id: '1',
      email: 'sachin@example.com',
      firstName: 'Sachin',
      age: 22
    }
  },
  post() {
    return {
      id: 20,
      body: 'hello',
      Published: false,
      title: 'this is just test'
    }
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    const filter = args.query.toLowerCase();
    return db.posts.filter(post => {
      return post.title.toLowerCase().includes(filter) || post.body.toLowerCase().includes(filter);
    });
  },
  users(parent, args, { db }, info) {
    if (!args.query) {
      return users;
    }
    const filter = args.query.toLowerCase();
    return db.users.filter((user) => {
      return user.firstName.toLowerCase().includes(filter)
    });

  },
  comments(parent, args, { db }, info) {
    return db.comments;
  }
}


export { Query as default }