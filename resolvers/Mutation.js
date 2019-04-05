import uuidV4 from 'uuid';
import ReadTimeCalc from '../Utils/ReadTimeCalculator';
const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);
    if (emailTaken) {
      throw new Error('This email already exists');
    }
    const user = {
      id: uuidV4(),
      ...args.data
    }
    db.users.push(user);
    return user;
  },
  editUser(parent, args, { db }, info) {
    const userId = args.id;
    const { data } = args;
    const user = db.users.find(user => user.id === userId);
    if (!user) {
      throw new Error('This user does not exists!');
    }
    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === data.email && user.id !== userId);
      if (emailTaken) {
        throw new Error('This email already exists');
      }
      user.email = data.email;
    }
    if (typeof data.firstName === 'string') {
      user.firstName = data.firstName;
    }
    if (typeof data.lastName !== 'undefined') {
      user.lastName = data.lastName;
    }
    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }
    if (typeof data.password === 'string' || typeof data.password === 'number' || typeof data.password === 'symbol') {
      user.password = data.password;
    }

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userId = args.id;
    const userIndex = db.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('This user does not exists!');
    }
    const removedUser = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter((post) => {
      const match = post.author === userId;
      if (match) {
        db.comments = db.comments.filter((comment) => {
          return comment.post !== post.id;
        });
      }
      db.comments = db.comments.filter(comment => comment.author !== userId);
      return !match;
    });
    return removedUser[0];
  },
  createPost(parent, args, { db, pubsub }, info) {
    const author = args.data.author;
    const authorExists = db.users.some((user) => user.id === author);
    if (!authorExists) {
      throw new Error('User does not exists');
    }
    const readTime = ReadTimeCalc(args.body);
    const post = {
      id: uuidV4(),
      readTime,
      ...args.data
    }
    db.posts.push(post);
    if (post.Published) {
      const payload = {
        mutation: 'Created',
        data: post
      }
      pubsub.publish('posts', { post: payload });
    }

    return post;
  },
  editPost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find(post => post.id === id);
    const originalPost = post;
    if (!post) {
      throw new Error('Post does not exists')
    }
    if (typeof data.body === 'string') {
      post.body = data.body;
      post.readTime = ReadTimeCalc(data.body);
    }
    if (typeof data.title === 'string') {
      post.title = data.title;
    }
    if (typeof data.Published === 'boolean') {
      post.Published = data.Published;
      if (post.Published && !originalPost.Published) {
        const payload = {
          mutation: 'Created',
          data: post
        }
        pubsub.publish('posts', { post: payload });
      }
      if (originalPost.Published && !post.Published) {
        const payload = {
          mutation: 'Deleted',
          data: originalPost
        }
        pubsub.publish('posts', { post: payload });
      }

      if (post.Published) {
        const payload = {
          mutation: 'Updated',
          data: post
        }
        pubsub.publish('posts', { post: payload });
      }

    }
    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postId = args.id;
    const postIndex = db.posts.findIndex(post => post.id === postId);
    if (postId === -1) {
      throw new Error('The post Does not exist');
    }
    const removedPost = db.posts.slice(postIndex, 1);
    db.comments = db.comments.filter(comment => comment.post !== postId);
    if (removedPost[0].Published) {
      const payload = {
        mutation: 'Deleted',
        data: removedPost[0]
      }
      pubsub.publish('posts', { post: payload })
    }
    return removedPost[0];
  },
  createComment(parent, args, { db, pubsub }, info) {
    const postId = args.data.post;
    const author = args.data.author;
    const authorExists = db.users.some((user) => user.id === author);
    const postExists = db.posts.some((post) => {
      return post.id == postId && post.Published === true;
    });
    if (!authorExists || !postExists) {
      throw new Error(`Something went wrong! ${authorExists} ${postExists}`);
    }
    const comment = {
      id: uuidV4(),
      ...args.data
    }
    db.comments.push(comment);
    const payload = {
      mutation: 'Created',
      data: comment
    }
    pubsub.publish(`comment_${postId}`, { comment: payload });
    return comment;
  },
  editComment(parent, args, { db, pubsub }, info) {
    const commentId = args.id;
    const { data } = args;
    const comment = db.comments.find((comment) => {
      return comment.id == commentId;
    });
    if (!comment) {
      throw new Error('Comment does not exists')
    }
    if (typeof data.text === 'string') {
      comment.text = data.text;
      const payload = {
        data: 'Updated',
        data: comment
      }
      pubsub.publish(`comment_${comment.postId}`, { comment: payload })
    }
    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentId = args.id;
    const commentIndex = db.comments.findIndex(comment => comment.id === commentId);
    if (commentIndex === -1) {
      throw new Error('Invalid Comment!');
    }
    db.comments = db.comments.filter(comment => comment.id !== commentId);
    const comment = comments[commentIndex];
    const payload = {
      data: 'Deleted',
      data: comment
    }
    pubsub.publish(`comment_${comment.postId}`, { comment: payload })
    return true;
  }
}

export { Mutation as default }