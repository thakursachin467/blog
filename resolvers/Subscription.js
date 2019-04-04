

const Subscription = {
  comment: {
    subscribe(parent, args, { db, pubsub }, info) {
      const { postId } = args;
      const post = db.posts.find(post => post.id === postId);
      if (!post) {
        throw new Error('Post does not exists!');
      }

      return pubsub.asyncIterator(`comment_${postId}`)
    }
  },
  post: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.asyncIterator(`posts`);
    }
  }
};

export { Subscription as default }