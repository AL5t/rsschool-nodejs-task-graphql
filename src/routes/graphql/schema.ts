import {GraphQLSchema } from 'graphql';
import createRootQuery from './resolvers/queries.js';
import createMutations from './resolvers/mutations.js';

export default function createPostSchema(prisma) {
  return new GraphQLSchema({
    query: createRootQuery(prisma),
    mutation: createMutations(prisma)
  });
}