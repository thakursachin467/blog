let posts = [{
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

let comments = [{
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


const db = {
  users,
  comments,
  posts
}

export { db as default }