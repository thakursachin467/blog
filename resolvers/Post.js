const Post = {
  author(parent, args, { db }, info) {
    const author = parent.author;
    return db.users.find(user => {
      return user.id === author;
    });
  },
  comments(parent, args, { db }, info) {
    const postId = parent.id;
    return db.comments.filter((comment) => {
      return comment.post === postId;
    })
  }
}


export { Post as default }