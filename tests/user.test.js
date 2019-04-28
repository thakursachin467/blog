import 'cross-fetch';
import ApolloBoost, { gql } from 'apollo-boost';
import prisma from '../prisma';
import { hashPassword } from '../Utils/hashPassword';
const client = new ApolloBoost({
  uri: "http://localhost:4000"
});

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  const createdUser = await prisma.mutation.createUser({
    data: {
      firstName: "Sachin",
      lastName: "Thakur",
      email: "sachin1@something.com",
      password: await hashPassword(123456789)
    }
  });
  const createdPostPublished = await prisma.mutation.createPost({
    data: {
      body: "This is my first post Published",
      Published: true,
      title: "This is it part 1",
      readTime: "11 seconds",
      author: {
        connect: {
          id: createdUser.id
        }
      }
    }
  });
  const createdPostDraft = await prisma.mutation.createPost({
    data: {
      body: "This is my second post Draft",
      Published: false,
      title: "This is it part 2",
      readTime: "11 seconds",
      author: {
        connect: {
          id: createdUser.id
        }
      }
    }
  });



});

test('should create a new user', async () => {
  const createUser = gql`
      mutation{
          createUser(data:{
            firstName:"Sachin",
            lastName:"Thakur",
            email:"sachin@something.com",
            password:"123456789"
          }){
            user{
              email
              id
              firstName
            }
            token
          }
}
    `
  const response = await client.mutate({
    mutation: createUser
  });
  const exists = await prisma.exists.User({ id: response.data.createUser.id });
  expect(exists).toBe(true);

});


test('should expose author profiles', async () => {
  const getUserProfiles = gql`
      query{
        users{
          id
          email
          firstName
          lastName
        }
      }
`
  const response = await client.query({
    query: getUserProfiles
  });
  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].firstName).toBe('Sachin');
  expect(response.data.users[0].lastName).toBe('Thakur');
});


test('should expose all public posts', async () => {
  const getUserPosts = gql`
  query{
  posts{
    Published
    body
    title
    readTime
  }
}
`
  const response = await client.query({
    query: getUserPosts
  });
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].Published).toBe(true);
})


