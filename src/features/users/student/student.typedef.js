// *************** GLOBAL VARIABLES ***************
const typeDefs = `#graphql
# *************** OBJECT TYPES ***************
type Student {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    student_number: String!
    registration_date: Date!
    academic_year_ids: [ID!]!
    academic_years: [AcademicYear!]!
}

type PaginatedStudentResponse {
    total_count: Int!
    current_page: Int!
    total_pages: Int!
    data: [Student]!
}

# *************** INPUT TYPES ***************
input CreateStudentInput {
    first_name: String!
    last_name: String!
    email: String!
    student_number: String!
}

input GetStudentsByAcademicYearInput {
    academic_year_id: ID!
    page: Int
    limit: Int
    search: String
}

type Query {
    GetStudentsByAcademicYear(input: GetStudentsByAcademicYearInput!): PaginatedStudentResponse!
}

# *************** MUTATIONS ***************
type Mutation {
    CreateStudent(input: CreateStudentInput!): Student!
}
`

// *************** EXPORT MODULE ***************
export { typeDefs }
