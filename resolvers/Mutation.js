import uuidV4 from 'uuid';
import ReadTimeCalc from '../Utils/ReadTimeCalculator';
const Mutation = {
  async createUser(parent, args, { database }, info) {
    const emailTaken = await database.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error('This email already registered with us!');
    }
    const user = await database.mutation.createUser({ data: args.data }, info);
    return user;
  },
  async editUser(parent, args, { database }, info) {
    const userId = args.id;
    const userExists = await database.exists.User({ id: userId });
    if (!userExists) {
      throw new Error('This user does not exists!');
    }
    const updatedUser = await database.mutation.updateUser({ where: { id: userId }, data: args.data }, info);
    return updatedUser;
  },
  async deleteUser(parent, args, { database }, info) {
    const userId = args.id;
    const userExists = await database.exists.User({ id: userId });
    if (!userExists) {
      throw new Error('This user does not exists!');
    }
    const userDeleted = await database.mutation.deleteUser({ where: { id: userId } }, info);
    return userDeleted;
  },
  async createPost(parent, args, { database, pubsub }, info) {
    const author = args.data.author;
    const authorExists = await database.exists.User({ id: author });
    if (!authorExists) {
      throw new Error('User does not exists');
    }
    const readTime = ReadTimeCalc(args.data.body);
    const post = {
      ...args.data,
      readTime,
      author: {
        connect: {
          id: args.data.author
        }
      }
    }
    console.log(post);
    let postCreated;
    if (post.Published) {
      const payload = {
        mutation: 'Created',
        data: post
      }
      pubsub.publish('posts', { post: payload });
    }
    postCreated = await database.mutation.createPost({ data: post }, info);
    return postCreated;
  },
  async editPost(parent, { id, data }, { database, pubsub }, info) {
    const post = await database.exists.Post({ id: id });
    const originalPost = post;
    if (!post) {
      throw new Error('Post does not exists')
    }
    if (typeof data.body === 'string') {
      data.body = data.body;
      data.readTime = ReadTimeCalc(data.body);
    }
    if (typeof data.title === 'string') {
      data.title = data.title;
    }
    if (typeof data.Published === 'boolean') {
      data.Published = data.Published;
    }
    const updatedPost = await database.mutation.updatePost({ where: { id: id }, data: data }, info);
    return updatedPost;
  },
  async deletePost(parent, args, { database, pubsub }, info) {
    const postId = args.id;
    const postIndex = await database.exists.Post({ id: postId });
    if (!postIndex) {
      throw new Error('The post Does not exist');
    }
    const deletedPost = await database.mutation.deletePost({ where: { id: postId } }, info);
    return deletedPost;
  },
  async  createComment(parent, args, { database, pubsub }, info) {
    const postId = args.data.post;
    const author = args.data.author;
    const authorExists = await database.exists.User({ id: author });
    const postExists = await database.exists.Post({ id: postId });
    if (!authorExists || !postExists) {
      throw new Error(`Something went wrong! ${authorExists} ${postExists}`);
    }
    const commentData = {
      text: args.data.text,
      post: {
        connect:
        {
          id: postId
        }
      },
      author:
      {
        connect:
        {
          id: author
        }
      }
    }
    const comment = await database.mutation.createComment({ data: commentData }, info);
    return comment;
  },
  async  editComment(parent, args, { database, pubsub }, info) {
    const commentId = args.id;
    const { data } = args;
    const comment = await database.exists.Comment({ id: commentId });
    if (!comment) {
      throw new Error('Comment does not exists')
    }
    const comment = await database.mutation.updateComment({ where: { id: commentId }, data: { text: data.text } }, info)
    return comment;
  },
  async deleteComment(parent, args, { database }, info) {
    const commentId = args.id;
    const commentIndex = await database.exists.Comment({ id: commentId });
    if (!commentIndex) {
      throw new Error('Invalid Comment!');
    }
    const deleteComment = await database.mutation.deleteComment({ where: { id: commentId } }, info);
    if (deleteComment) {
      return true;
    } else {
      return false;
    }
  }
}

export { Mutation as default }