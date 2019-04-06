import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: './generated/database.graphql',
  endpoint: 'http://localhost:4466/',
})


//prisma.query.users(null, '{firstName lastName id email}')
// .then((data) => {
//   console.log(data)
// })
//  .catch((err) => console.log(err));


//prisma.query.comments(null, '{id text author {firstName} post {body}}')
// .then((data) => {
//   console.log(JSON.stringify(data, undefined, 4))
//})
//.catch((err) => console.log(err));


//prisma.mutation.createUser({ data: { firstName: 'Sachin', lastName: 'Thakur', email: 'thakursachin4678@gmail.com' } },
//  '{id firstName lastName email}')
// .then((data) => {
//   console.log(data);
//
// })
// .catch((err) => {
//   console.log(err)
//});


const getUsers = async (filter) => {
  const user = await prisma.query.users(null, `${filter}`);
  return user;
}


const getUser = async (authorId, filter) => {
  const user = await prisma.query.user({ where: { id: authorId } }, `${filter}`);
  return user;
}


const createCommentForUser = async (author, data, filter) => {

}


const getPost = async (postId, filter) => {
  const post = await prisma.query.post({ where: { id: postId } }, filter);
  try {
    return post;
  } catch (err) {
    return err;
  }
}

const getPosts = async (filter) => {
  const posts = await prisma.query.post(null, filter);
  try {
    return posts;
  } catch (err) {
    return err;
  }
};


const userExists = async (filter) => {
  const userExists = await prisma.exists.User(filter);
  try {
    return userExists;
  } catch (err) {
    return err;
  }
};

const commentExists = async (filter) => {
  const commentExists = await prisma.exists.Comment(filter);
  try {
    return commentExists;
  } catch (err) {
    return err;
  }
}


const postExists = async (filter) => {
  const postExists = await prisma.exists.Post(filter);
  try {
    return postExists;
  } catch (err) {
    return err;
  }
}

const updatePostForUser = async (postId, data, filter) => {
  const updateData = {
    data: {
      ...data
    },
    where: {
      id: postId
    }
  }

  const updatedPost = await prisma.mutation.updatePost(updateData, filter);
  return updatedPost;
};

const createPostForUser = async (author, data, filter) => {
  const postData = {
    ...data,
    author: {
      connect: {
        id: author
      }
    }
  }
  const post = await prisma.mutation.createPost({ data: postData }, filter);
  try {
    return post;
  } catch (error) {
    return error;
  }
};


//updatePostForUser("cju58rwiw003n0824bl26cdwi", {
//  "title": "This is it part 4",
//  "Published": false
//}, '{id  body  author{   firstName  } title  Published}')
 // .then((data) => {
//    console.log(data);
 // })
 // .catch((err) => {
 //   console.log(err)
//  })

//createPostForUser("cju3vc7aa007k0824l7nrx5oi", {
//  body: "This is my second post",
//  Published: true,
//  title: "This is it part 3",
 // readTime: "11 seconds"
//}, '{body title Published author{ id email  firstName}}'
//).then((data) => {
 // console.log(data);
//}).catch((err) => console.log(err))