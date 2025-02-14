import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { userSchema } from "./typeDefs/user.schema.js";
import { todoSchema } from "./typeDefs/todo.schema.js";
import { userResolver } from "./resolvers/user.resolver.js";
import { todoResolver } from './resolvers/todo.resolver.js'

export const typeDefs = mergeTypeDefs([userSchema, todoSchema]);
export const resolvers = mergeResolvers([userResolver, todoResolver]);
