import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from "graphql";
import UserType from "../types/User.js";
import { UUIDType } from "../types/uuid.js";
import Post from "../types/Post.js";
import Profile from "../types/Profile.js";
import MemberType, { MemberTypeId } from "../types/MemberType.js";

export default function createRootQuery(prisma) {
  return new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
        resolve: async () => {
          const users = await prisma.user.findMany({
            include:{
              profile: {include: {memberType: true}},
              posts: true,
            }
          });

          return users.map((user) => ({
            ...user,
            profile: user.profile ?? null,
            posts: user.posts ?? []
          }));
        }
      },

      user: {
        type: UserType,
        args: {id: {type: new GraphQLNonNull(UUIDType)}},
        resolve: async (_, {id}) => {
          const user = await prisma.user.findUnique({
            where: {id},
            include: {
              profile: {include: {memberType: true}},
              posts: true
            }
          });

          if(!user) {
            return null;
          }

          return {
            ...user,
            rofile: user.profile ?? null,
            posts: user.posts ?? []
          };
        }
      },

      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
        resolve: async () => {
          const posts = await prisma.post.findMany();
          return posts ?? [];
        }
      },

      post: {
        type: Post,
        args: {id: {type: new GraphQLNonNull(UUIDType)}},
        resolve: async (_, {id}) => {
          const post = await prisma.post.findUnique({where: {id}});
          return post ?? null;
        }
      },

      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
        resolve: async () => {
          const profiles = await prisma.profile.findMany({include: {memberType: true}});
          return profiles ?? [];
        }
      },

      profile: {
        type: Profile,
        args: {id: {type: new GraphQLNonNull(UUIDType)}},
        resolve: async (_, {id}) => {
          const profile = await prisma.profile.findUnique({where: {id}, include: {memberType: true}});
          return profile ?? null;
        }
      },

      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: async () => {
          const memberTypes = await prisma.memberType.findMany();
          return memberTypes ?? [];
        }
      },

      memberType: {
        type: MemberType,
        args: {id: {type: new GraphQLNonNull(MemberTypeId)}},
        resolve: async (_, {id}) => {
          const memberType = await prisma.memberType.findUnique({where: {id}});
          return memberType ?? null;
        }
      },
    }
  });
};