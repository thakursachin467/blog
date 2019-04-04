const Comment = {
  author(parent, args, { db }, info) {
    const author = parent.author;
    return db.users.find(user => {
      return user.id === author;
    });
  },
  post(parent, args, { db }, info) {
    const postId = parent.post;
    return db.posts.find((post) => {
      return post.id === postId;
    })
  }
}


export { Comment as default }