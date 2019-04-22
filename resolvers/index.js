import Comment from './Comment';
import Mutation from './Mutation';
import Query from './Query';
import User from './User';
import Post from './Post';
import Subscription from './Subscription';
import { extractFragmentReplacements } from 'prisma-binding';
const resolvers = {
  Post,
  User,
  Query,
  Mutation,
  Comment,
  Subscription
}

const fragmentReplacements = extractFragmentReplacements(resolvers);
export { resolvers, fragmentReplacements }