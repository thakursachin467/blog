import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import { Mutation, Query, Post, User, Comment, Subscription } from './resolvers/index';
import database from './prisma';
const Port = process.env.Port || 8000;
import * as Sentry from '@sentry/node';
import Keys from './Config/Credintials/Keys';

Sentry.init({ dsn: Keys.sentryKey });

const pubsub = new PubSub();

const resolvers = {
  Mutation,
  Query,
  Post,
  User,
  Comment,
  Subscription
}


const server = new GraphQLServer(
  {
    typeDefs: './schema.graphql',
    resolvers,
    context(request) {
      return {
        db,
        database,
        pubsub,
        request
      }
    }
  });

server.start({ port: Port }, () => {
  console.log(`Server Starting on port ${Port}`)
})