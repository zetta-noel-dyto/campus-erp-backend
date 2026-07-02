const typeDefs = `#graphql
scalar Date

type Student {
    first_name: String!
    last_name: String!
    email: String!
    student_number: String!
    registration_date: Date!
    academic_year_ids: [ID!]!
}

input CreateStudentInput {
    first_name: String!
    last_name: String!
    email: String!
    student_number: String!
    academic_year_ids: [ID!]!
}

type Mutation {
    CreateStudent(input: CreateStudentInput!): Student!
}
`

export {
    typeDefs
}