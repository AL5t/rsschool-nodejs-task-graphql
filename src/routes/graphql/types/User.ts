import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { UUIDType } from "./uuid.js";
import Profile from "./Profile.js";
import Post from "./Post.js";

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    profile: { 
      type: Profile,
      resolve: (user) => {
        return user.profile ?? null;
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: (user) => user.posts ?? [],
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _, {prisma}) => {
        if(!user) {
          return [];
        }

        const list = await prisma.user.findMany({
          where: {
            subscribedToUser: {some: {subscriberId: user.id}},
          },
          include: {
            profile: {include: { memberType: true}},
            posts: true,
          },
        });

        return list.map(user => ({
          ...user,
          profile: user.profile ?? null,
          posts: user.posts ?? []
        }));
      },
    },

    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, _, {prisma}) => {
        const list = await prisma.user.findMany({
          where: {
            userSubscribedTo: {some: {authorId: user.id}},
          },
          include: {
            profile: {include: { memberType: true}},
            posts: true,
          },
        });

        return list.map(user => ({
          ...user,
          profile: user.profile ?? null,
          posts: user.posts ?? []
        }));
      },
    },
  }),
});

export default UserType;