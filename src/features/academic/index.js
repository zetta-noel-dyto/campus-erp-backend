// *************** IMPORT MODULE ***************
import { resolver as curriculumResolvers } from './curriculum/curriculum.mutation.resolver.js';
import { resolver as enrollmentResolvers } from './enrollment/enrollment.resolver.js';
import { resolver as gradingResolvers } from './grading/grading.mutation.resolver.js';
import { typeDefs as curriculumTypeDefs } from './curriculum/curriculum.typedef.js';
import { typeDefs as enrollmentTypeDefs } from './enrollment/enrollment.typedef.js';
import { typeDefs as gradingTypeDefs } from './grading/grading.typedef.js';

// *************** EXPORT MODULE ***************
export { curriculumResolvers, curriculumTypeDefs, enrollmentResolvers, enrollmentTypeDefs, gradingResolvers, gradingTypeDefs };
