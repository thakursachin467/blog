import { hashPassword } from '../Utils/hashPassword';
import ReadTimeCalc from '../Utils/ReadTimeCalculator';
import authorization from '../Utils/Authorization';
import { generateToken } from '../Utils/generateToken';
const Mutation = {
  async createUser(parent, args, { database }, info) {
    const emailTaken = await database.exists.User({ email: args.data.email });
    const password = args.data.password;
    if (emailTaken) {
      throw new Error('This email already registered with us!');
    }
    const newPassword = await hashPassword(password);
    const user = await database.mutation.createUser({
      data: {
        ...args.data,
        password: newPassword
      }
    });
    const token = generateToken(user);
    return {
      user,
      token
    };
  },
  async loginUser(parent, args, { database }, info) {
    const { email, password } = args.data;
    const user = await database.query.User({ where: { email: email } });
    if (!user) {
      throw new Error('Unable to login! Incorrect Credintials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Unable to login! Incorrect Credintials');
    }
    const token = generateToken(user);
    return {
      user,
      token
    }
  },
  async editUser(parent, args, { database, request }, info) {
    const userId = authorization(request)
    const userExists = await database.exists.User({ id: userId });
    if (!userExists) {
      throw new Error('This user does not exists!');
    }
    const updatedUser = await database.mutation.updateUser({ where: { id: userId }, data: args.data }, info);
    return updatedUser;
  },
  async deleteUser(parent, args, { database, request }, info) {
    const userId = authorization(request)
    const userExists = await database.exists.User({ id: userId });
    if (!userExists) {
      throw new Error('This user does not exists!');
    }
    const userDeleted = await database.mutation.deleteUser({ where: { id: userId } }, info);
    return userDeleted;
  },
  async createPost(parent, args, { database, request }, info) {
    const userId = authorization(request)
    const authorExists = await database.exists.User({ id: userId });
    if (!authorExists) {
      throw new Error('User does not exists');
    }
    const readTime = ReadTimeCalc(args.data.body);
    const post = {
      ...args.data,
      readTime,
      author: {
        connect: {
          id: userId
        }
      }
    }
    let postCreated;
    postCreated = await database.mutation.createPost({ data: post }, info);
    return postCreated;
  },
  async editPost(parent, { id, data }, { database, request }, info) {
    const userId = authorization(request)
    const postFound = await database.exists.Post({ id: postId, author: { id: userId } });
    if (!postFound) {
      throw new Error('You are not authorize to perform this action!')
    }
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
  async deletePost(parent, args, { database, request }, info) {
    const userId = authorization(request)
    const postId = args.id;
    const postFound = await database.exists.Post({ id: postId, author: { id: userId } });
    if (!postFound) {
      throw new Error('You are not authorize to perform this action!')
    }
    const postIndex = await database.exists.Post({ id: postId });
    if (!postIndex) {
      throw new Error('The post Does not exist');
    }
    const deletedPost = await database.mutation.deletePost({ where: { id: postId } }, info);
    return deletedPost;
  },
  async  createComment(parent, args, { database, request }, info) {
    const postId = args.data.post;
    const author = authorization(request);
    const authorExists = await database.exists.User({ id: author });
    const postExists = await database.exists.Post({ id: postId, Published: true });
    if (!authorExists || !postExists) {
      throw new Error(`Something went wrong!`);
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
  async  editComment(parent, args, { database, request }, info) {
    const author = authorization(request);
    const commentId = args.id;
    const commentExistsWithAuthor = await database.exists.Comment({ id: commentId, author: { id: author } });
    if (!commentExistsWithAuthor) {
      throw new Error('You are not authorize to perform this action');
    }
    const { data } = args;
    const comment = await database.mutation.updateComment({ where: { id: commentId }, data: { text: data.text } }, info)
    return comment;
  },
  async deleteComment(parent, args, { database, request }, info) {
    const author = authorization(request);
    const commentId = args.id;
    const commentExists = await database.exists.Comment({ id: commentId, author: { id: author } });
    if (!commentExists) {
      throw new Error('You are not authorize to perform this action');
    }
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