// *************** GLOBAL VARIABLES ***************
const typeDefs = `#graphql
# *************** OBJECT TYPES ***************
type StudentGrade {
    _id: ID!
    student_id: ID!
    test_id: ID!
    academic_year_id: ID!
    score: Float!
}

# *************** INPUT TYPES ***************
input StudentScoreInput {
    student_id: ID!
    score: Float!
}

input SubmitTestGradesInput {
    academic_year_id: ID!
    test_id: ID!
    grades: [StudentScoreInput!]!
}

# *************** MUTATIONS ***************
type Mutation {
    SubmitTestGrades(input: SubmitTestGradesInput!): [StudentGrade!]! @auth(requires: teacher)
}
`

// *************** EXPORT MODULE ***************
export { typeDefs }
