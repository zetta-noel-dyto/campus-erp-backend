// *************** GLOBAL VARIABLES ***************
const typeDefs = `#graphql

type GradingRule {
    id: ID!
    label: String!
    operator: String!
    threshold: Float!
}

type Block {
    id: ID!
    name: String!
    academic_year: String!
    grading_rules: [GradingRule!]!   
}

type Subject {
    id: ID!
    name: String!
    block_id: ID!
    weightage: Float!
    grading_rules: [GradingRule!]!
}

type Test {
    id: ID!
    name: String!
    subject_id: ID!
    weightage: Float!
    grading_rules: [GradingRule!]!
}

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

type Mutation {
    CreateBlock(input: CreateBlockInput!): Block!
    UpdateBlock(id: ID!, input: UpdateBlockInput!): Block!
    DeleteBlock(id: ID!): [Block]

    CreateSubject(input: CreateSubjectInput!): Subject!
    UpdateSubject(id: ID!, input: UpdateSubjectInput!): Subject!
    DeleteSubject(id: ID!): [Subject]

    CreateTest(input: CreateTestInput!): Test!
    UpdateTest(id: ID!, input: UpdateTestInput!): Test!
    DeleteTest(id: ID!): [Test]
}
`

// *************** EXPORT MODULE ***************
export {
    typeDefs
}