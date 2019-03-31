import { GraphQLServer } from 'graphql-yoga'
const Port = process.env.Port || 8000;


const typeDefs = `
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String
    age: Int
  }

  type Post {
    id: ID!
    body: String!
    Published: Boolean!
    title: String!
  }
  type Query {
    me: User!
    post: Post!
    users(query: String):[User!]!
    posts(query:String):[Post!]!
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
      const posts = [{
        id: 10,
        body: 'optional',
        Published: true,
        title: 'this is test 1',
      }, {
        id: 11,
        body: 'optional1',
        Published: true,
        title: 'this is test 11',
      }, {
        id: 12,
        body: 'optional2',
        Published: true,
        title: 'this is test 12',
      }]
      if (!args.query) {
        return posts;
      }
      const filter = args.query.toLowerCase();
      return posts.filter(post => {
        return post.title.toLowerCase().includes(filter) || post.body.toLowerCase().includes(filter);
      });
    },
    users(parent, args, ctx, info) {
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
      }]
      if (!args.query) {
        return users;
      }
      const filter = args.query.toLowerCase();
      return users.filter((user) => {
        return user.firstName.toLowerCase().includes(filter)
      });

    }
  }
}


const server = new GraphQLServer({ typeDefs, resolvers });

server.start({ port: Port }, () => {
  console.log(`Server Starting on port ${Port}`)
})