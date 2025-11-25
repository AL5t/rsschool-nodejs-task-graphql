import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "../types/User.js";
import { ChangePostInput, ChangeProfileInput, ChangeUserInput, CreatePostInput, CreateProfileInput, CreateUserInput } from "../inputs/inputs.js";
import Profile from "../types/Profile.js";
import Post from "../types/Post.js";
import { UUIDType } from "../types/uuid.js";

export default function createMutations(prisma) {
  return new GraphQLObjectType({
    name: 'Mutations',
    fields: () => ({
      createUser: {
        type: new GraphQLNonNull(UserType),
        args: { dto: {type: new GraphQLNonNull(CreateUserInput)}},
        resolve: async (_, {dto}, {prisma}) => prisma.user.create({data: dto}),
      },

      createProfile: {
        type: new GraphQLNonNull(Profile),
        args: { dto: { type: new GraphQLNonNull(CreateProfileInput)}},
        resolve: async (_, {dto}, {prisma}) => {
          return prisma.profile.create({
            data: {
              isMale: dto.isMale,
              yearOfBirth: dto.yearOfBirth,
              userId: dto.userId,
              memberTypeId: dto.memberTypeId
            },
            include: {
              memberType: true,
            }
          });
        }
      },

      createPost: {
        type: new GraphQLNonNull(Post),
        args: { dto: { type: new GraphQLNonNull(CreatePostInput)}},
        resolve: async (_, {dto}, {prisma}) => {
          return prisma.post.create({
            data: {
              title: dto.title,
              content: dto.content,
              authorId: dto.authorId,
            }
          });
        }
      },

      changeUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType)},
          dto: { type: new GraphQLNonNull(ChangeUserInput)}
        },
        resolve: async (_, {id, dto}, {prisma}) => {
          return prisma.user.update({
            where: {id},
            data: dto
          });
        },
      },

      changeProfile: {
        type: new GraphQLNonNull(UserType),
        args: {
          id: { type: new GraphQLNonNull(UUIDType)},
          dto: { type: new GraphQLNonNull(ChangeProfileInput)}
        },
        resolve: async (_, {id, dto}, {prisma}) => {
          return prisma.profile.update({
            where: {id},
            data: {
              ...(dto.isMale !== undefined && {isMale: dto.isMale}),
              ...(dto.yearOfBirth !== undefined && {yearOfBirth: dto.yearOfBirth}),
              ...(dto.memberTypeId !== undefined && {memberTypeId: dto.memberTypeId}),
            },
            include: {memberType: true}
          });
        },
      },

      changePost: {
        type: new GraphQLNonNull(Post),
        args: {
          id: { type: new GraphQLNonNull(UUIDType)},
          dto: { type: new GraphQLNonNull(ChangePostInput)}
        },
        resolve: async (_, {id, dto}, {prisma}) => {
          return prisma.post.update({
            where: {id},
            data: dto,
          });
        },
      },
      
      deleteUser: {
        type: new GraphQLNonNull(GraphQLString),
        args: { id: {type: new GraphQLNonNull(UUIDType)}},
        resolve: async (_, {id}, {prisma}) => {
          await prisma.user.delete({
            where: {id},
          });
          return true;
        },
      },

      deletePost: {
        type: new GraphQLNonNull(GraphQLString),
        args: { id: {type: new GraphQLNonNull(UUIDType)}},
        resolve: async (_, {id}, {prisma}) => {
          await prisma.post.delete({
            where: {id},
          });
          return true;
        },
      },

      deleteProfile: {
        type: new GraphQLNonNull(GraphQLString),
        args: { id: {type: new GraphQLNonNull(UUIDType)}},
        resolve: async (_, {id}, {prisma}) => {
          await prisma.profile.delete({
            where: {id},
          });
          return true;
        },
      },

      subscribeTo: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: {type: new GraphQLNonNull(UUIDType)},
          authorId: {type: new GraphQLNonNull(UUIDType)},
        },
        resolve: async (_, {userId, authorId}, {prisma}) => {
          await prisma.subscribersOnAuthors.create({
            data: {
              subscriberId: userId,
              authorId,
            },
          });
          return true;
        },
      },

      unsubscribeFrom: {
        type: new GraphQLNonNull(GraphQLString),
        args: {
          userId: {type: new GraphQLNonNull(UUIDType)},
          authorId: {type: new GraphQLNonNull(UUIDType)},
        },
        resolve: async (_, {userId, authorId}, {prisma}) => {
          await prisma.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId
              },
            },
          });
          return true;
        },
      }
    })
  });
}
