import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { UUIDType } from "./uuid.js";
import MemberType from "./MemberType.js";

export default new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: {type: new GraphQLNonNull(UUIDType)},
    isMale: {type: new GraphQLNonNull(GraphQLBoolean)},
    yearOfBirth: {type: new GraphQLNonNull(GraphQLInt)},
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async(profile, _, {prisma}) => {
        return await prisma.memberType.findUnique({
          where: { id: profile.memberTypeId}
        }) ?? null;
      }
    },
  }
});