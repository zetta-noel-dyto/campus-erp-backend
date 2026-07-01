// *************** IMPORT MODULE ***************
import { resolver } from "./curriculum.mutation.resolver.js";
import { typeDefs } from "./curriculum.typedef.js";

// *************** GLOBAL VARIABLES ***************
const curriculumResolvers = resolver;
const curriculumTypeDefs = typeDefs;

// *************** EXPORT MODULE ***************
export {
    curriculumResolvers,
    curriculumTypeDefs
}