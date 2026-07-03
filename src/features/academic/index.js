// *************** IMPORT MODULE ***************
import { resolver as curriculumResolvers } from "./curriculum/curriculum.mutation.resolver.js";
import { resolver as enrollmentResolvers } from "./enrollment/enrollment.resolver.js";
import { typeDefs as curriculumTypeDefs } from "./curriculum/curriculum.typedef.js";
import { typeDefs as enrollmentTypeDefs } from "./enrollment/enrollment.typedef.js";

// *************** EXPORT MODULE ***************
export {
    curriculumResolvers,
    curriculumTypeDefs,
    enrollmentResolvers,
    enrollmentTypeDefs
}