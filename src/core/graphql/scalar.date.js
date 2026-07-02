import { GraphQLScalarType, Kind } from "graphql";

const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Custom date type',
    serialize: (value) => new Date(value).toISOString(),
    parseValue: (value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) return null;
        return date;
    },
    parseLiteral: (ast) => {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
            if (isNaN(date.getTime())) return null;
            return date;
        }

        return null;
    }
})

export {
    DateScalar
}