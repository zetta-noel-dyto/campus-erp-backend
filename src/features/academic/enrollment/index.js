import { resolver } from "./enrollment.resolver.js";
import { typeDefs } from "./enrollment.typedef.js";

const enrollmentResolvers = resolver;
const enrollmentTypeDefs = typeDefs;

export {
    enrollmentResolvers,
    enrollmentTypeDefs
}