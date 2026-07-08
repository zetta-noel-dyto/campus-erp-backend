// *************** GLOBAL VARIABLES ***************
// GraphQL schema definition containing curriculum-related types,
// input objects, and mutation operations exposed by this module.
const typeDefs = `#graphql
# *************** OBJECT TYPES ***************
type GradingRule {
    _id: ID!
    label: String!
    operator: String!
    threshold: Float!
}

type Block {
    _id: ID!
    name: String!
    academic_year: String!
    grading_rules: [GradingRule!]!
}

type Subject {
    _id: ID!
    name: String!
    block_id: ID!
    weightage: Float!
    grading_rules: [GradingRule!]!
}

type Test {
    _id: ID!
    name: String!
    subject_id: ID!
    weightage: Float!
    grading_rules: [GradingRule!]!
}

# *************** INPUT TYPES ***************
input GradingRuleInput {
    label: String!
    operator: String!
    threshold: Float!
}

input CreateBlockInput {
    name: String!
    academic_year: String!
    grading_rules: [GradingRuleInput!]!
}

input UpdateBlockInput {
    name: String
    academic_year: String
    grading_rules: [GradingRuleInput!]
}

input CreateSubjectInput {
    name: String!
    block_id: ID!
    weightage: Float!
    grading_rules: [GradingRuleInput!]!
}

input UpdateSubjectInput {
    name: String
    block_id: ID
    weightage: Float
    grading_rules: [GradingRuleInput!]
}

input CreateTestInput {
    name: String!
    subject_id: ID!
    weightage: Float!
    grading_rules: [GradingRuleInput!]!
}

input UpdateTestInput {
    name: String
    subject_id: ID
    weightage: Float
    grading_rules: [GradingRuleInput!]
}

# *************** MUTATIONS ***************
type Mutation {
    CreateBlock(input: CreateBlockInput!): Block! @auth(requires: admin)
    UpdateBlock(id: ID!, input: UpdateBlockInput!): Block!
    DeleteBlock(id: ID!): Block

    CreateSubject(input: CreateSubjectInput!): Subject! @auth(requires: admin)
    UpdateSubject(id: ID!, input: UpdateSubjectInput!): Subject!
    DeleteSubject(id: ID!): Subject

    CreateTest(input: CreateTestInput!): Test! @auth(requires: admin)
    UpdateTest(id: ID!, input: UpdateTestInput!): Test!
    DeleteTest(id: ID!): Test
}
`;

// *************** EXPORT MODULE ***************
export { typeDefs };
