import { resolver } from "./student.resolver.js";
import { typeDefs } from "./student.typedef.js";

const studentResolver = resolver;
const studentTypeDefs = typeDefs;

export {
    studentResolver,
    studentTypeDefs
}