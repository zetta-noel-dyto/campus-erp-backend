// *************** IMPORT MODULE ***************
import { resolver as authResolvers } from './auth/auth.resolver.js'
import { resolver as studentResolver } from './student/student.resolver.js'
import { typeDefs as authTypeDefs } from './auth/auth.typedef.js'
import { typeDefs as studentTypeDefs } from './student/student.typedef.js'

// *************** EXPORT MODULE ***************
export { authResolvers, authTypeDefs, studentResolver, studentTypeDefs }
