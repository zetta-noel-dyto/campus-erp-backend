// *************** IMPORT MODULE ***************
import { resolver } from './student/student.resolver.js';
import { typeDefs } from './student/student.typedef.js';

// *************** GLOBAL VARIABLES ***************
const studentResolver = resolver;
const studentTypeDefs = typeDefs;

// *************** EXPORT MODULE ***************
export { studentResolver, studentTypeDefs };
