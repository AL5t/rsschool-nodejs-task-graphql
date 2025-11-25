import {GraphQLSchema } from 'graphql';
import createRootQuery from './resolvers/queries.js';

export default function createPostSchema(prisma) {
  return new GraphQLSchema({
    query: createRootQuery(prisma),
  });
}