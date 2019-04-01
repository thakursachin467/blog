import { GraphQLServer } from 'graphql-yoga'
const Port = process.env.Port || 8000;

const posts = [{
  id: '10',
  body: 'optional',
  Published: true,
  title: 'this is test 1',
  author: '10'
}, {
  id: '11',
  body: 'optional1',
  Published: true,
  title: 'this is test 11',
  author: '11'
}, {
  id: '12',
  body: 'optional2',
  Published: true,
  title: 'this is test 12',
  author: '10'
}];
let users = [{
  id: '10',
  email: 'thakur@example.com',
  firstName: 'Sachin',
  age: 22
}, {
  id: '11',
  email: 'thakur1@example.com',
  firstName: 'Sachin1',
  lastName: 'thakur',
  age: 21
}, {
  id: '12',
  email: 'thakur2@example.com',
  firstName: 'Sachin2',
  age: 23
}];

const comments = [{
  id: '100',
  text: 'this is awsome',
  author: '10',
  post: '10'
}, {
  id: '101',
  text: 'this is awsomeq1',
  author: '11',
  post: '12'
}, {
  id: '102',
  text: 'this is awsomee3',
  author: '10',
  post: '12'
}, {
  id: '103',
  text: 'this is awsomed4',
  author: '11',
  post: '10'
}]

const typeDefs = `
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  type Post {
    id: ID!
    body: String!
    Published: Boolean!
    title: String!
    author: User!
    comments:[Comment!]!
  }
  type Query {
    me: User!
    post: Post!
    users(query: String):[User!]!
    posts(query:String):[Post!]!
    comments:[Comment!]!
  }

`


const resolvers = {
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
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      const filter = args.query.toLowerCase();
      return posts.filter(post => {
        return post.title.toLowerCase().includes(filter) || post.body.toLowerCase().includes(filter);
      });
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      const filter = args.query.toLowerCase();
      return users.filter((user) => {
        return user.firstName.toLowerCase().includes(filter)
      });

    },
    comments(parent, args, ctx, info) {
      return comments;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      const author = parent.author;
      return users.find(user => {
        return user.id === author;
      });
    },
    comments(parent, args, ctx, info) {
      const postId = parent.id;
      return comments.filter((comment) => {
        return comment.post === postId;
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      const userId = parent.id;
      return posts.filter((post) => {
        return post.author === userId;
      })
    },
    comments(parent, args, ctx, info) {
      const userId = parent.id;
      return comments.filter((comment) => {
        return comment.author === userId;
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      const author = parent.author;
      return users.find(user => {
        return user.id === author;
      });
    },
    post(parent, args, ctx, info) {
      const postId = parent.post;
      return posts.find((post) => {
        return post.id === postId;
      })
    }
  }
}


const server = new GraphQLServer({ typeDefs, resolvers });

server.start({ port: Port }, () => {
  console.log(`Server Starting on port ${Port}`)
})