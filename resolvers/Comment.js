const Comment = {
  async author(parent, args, { db, database }, info) {
    const authorId = parent.author;
    const comment = await database.query.comments({ where: { author: authorId } }, info);
    console.log(comment);
    return comment;
    // const author = parent.author;
    // return db.users.find(user => {
    //   return user.id === author;
    // });
  },
  async post(parent, args, { db, database }, info) {
    const postId = parent.post;
    const post = await database.query.post({ where: { id: postId } }, info);
    console.log(post);
    return post;
    //  const postId = parent.post;
    //  return db.posts.find((post) => {
    //    return post.id === postId;
    //  })

  }
}


export { Comment as default }