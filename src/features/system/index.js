// *************** IMPORT MODULE ***************
import { resolver } from './system.query.resolver.js';
import { typeDefs } from './system.typedef.js';

// *************** GLOBAL VARIABLES ***************
const systemResolvers = resolver;
const systemTypeDefs = typeDefs;

// *************** EXPORT MODULE ***************
export { systemResolvers, systemTypeDefs };
