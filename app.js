import { GraphQLServer } from 'graphql-yoga';
import uuidV4 from 'uuid';
import db from './db';
const Port = process.env.Port || 8000;


const resolvers = {
  Mutation: {
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
    createPost(parent, args, { db }, info) {
      const author = args.data.author;
      const authorExists = db.users.some((user) => user.id === author);
      if (!authorExists) {
        throw new Error('User does not exists');
      }
      const post = {
        id: uuidV4(),
        ...args.data
      }
      db.posts.push(post);
      return post;
    },
    deletePost(parent, args, { db }, info) {
      const postId = args.id;
      const postIndex = db.posts.findIndex(post => post.id === postId);
      if (postId === -1) {
        throw new Error('The post Does not exist');
      }
      const removedPost = db.posts.slice(postIndex, 1);
      db.comments = db.comments.filter(comment => comment.post !== postId);
      return removedPost[0];
    },
    createComment(parent, args, { db }, info) {
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
      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const commentId = args.id;
      const commentIndex = db.comments.findIndex(comment => comment.id === commentId);
      if (commentIndex === -1) {
        throw new Error('Invalid Comment!');
      }
      db.comments = db.comments.filter(comment => comment.id !== commentId);
      return true;
    }
  },
  Query: {
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
        return posts;
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
      return comments;
    }
  },
  Post: {
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
  },
  User: {
    posts(parent, args, { db }, info) {
      const userId = parent.id;
      return db.posts.filter((post) => {
        return post.author === userId;
      })
    },
    comments(parent, args, { db }, info) {
      const userId = parent.id;
      return db.comments.filter((comment) => {
        return comment.author === userId;
      })
    }
  },
  Comment: {
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
}


const server = new GraphQLServer(
  {
    typeDefs: './schema.graphql',
    resolvers,
    context: {
      db
    }
  });

server.start({ port: Port }, () => {
  console.log(`Server Starting on port ${Port}`)
})