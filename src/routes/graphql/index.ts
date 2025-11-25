import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import createSchem from './schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const schema = createSchem(prisma);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const result = await (graphql as any)({
        schema: schema as GraphQLSchema,
        source: query,
        variableValues: variables,
        contextValue: { prisma },
        validationRules: [depthLimit(5)]
      })

      return result;
    },
  });
};

export default plugin;
