import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: './generated/database.graphql',
  endpoint: 'http://localhost:4466/',
})