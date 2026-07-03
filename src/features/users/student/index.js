// *************** IMPORT MODULE ***************
import { resolver } from "./student.resolver.js";
import { typeDefs } from "./student.typedef.js";

// *************** GLOBAL VARIABLES ***************
const studentResolver = resolver;
const studentTypeDefs = typeDefs;

// *************** EXPORT MODULE ***************
export {
    studentResolver,
    studentTypeDefs
}