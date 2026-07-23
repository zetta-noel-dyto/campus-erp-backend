// *************** IMPORT MODULE ***************
import { AppError } from '../core/error.js'
import {
  BlockModel as Blocks,
  SubjectModel as Subjects,
  TestModel as Tests
} from '../features/academic/curriculum/curriculum.model.js'
import { StudentGradeModel as StudentGrades } from '../features/academic/grading/student_grade.model.js'

// *************** HELPER FUNCTION ***************
/**
 * Evaluates a comparison rule between value and threshold.
 * @param {number} value - Value to be compared.
 * @param {string} operator - Comparison operator used by grading rule.
 * @param {number} threshold - Target value used for comparison.
 * @returns {boolean} Result of the comparison.
 */
const compareValue = (value, operator, threshold) => {
  switch (operator) {
    case '>':
      return value > threshold
    case '<':
      return value < threshold
    case '>=':
      return value >= threshold
    case '<=':
      return value <= threshold
    case '==':
      return value === threshold
    default:
      return false
  }
}

/**
 * Evaluates grading rules and returns the matching status label.
 * @param {number} value - Score value to evaluate.
 * @param {Array<Object>} rules - Available grading rules.
 * @returns {string} Matching grade label or default fail status.
 */
const evaluateGradingRules = (value, rules = []) => {
  const sortedRules = [...rules].sort((a, b) => b.threshold - a.threshold)
  const matchedRule = sortedRules.find((rule) => compareValue(value, rule.operator, rule.threshold))

  return matchedRule?.label ?? 'Fail'
}

/**
 * Calculates average value from provided numbers.
 * @param {Array<number>} numbers - Collection of numeric values.
 * @returns {number} Rounded average value with two decimal precision.
 */
const calculateAverage = (numbers) => {
  if (!numbers.length) return 0
  const total = numbers.reduce((sum, value) => sum + value, 0)

  return Number((total / numbers.length).toFixed(2))
}

/**
 * Aggregates student grades and creates bulk update operations for academic standings.
 * @param {Array<string>} student_ids - List of student identifiers to process.
 * @param {string} test_id - Test identifier used as aggregation starting point.
 * @param {string} academic_year_id - Academic year identifier for grade context.
 * @returns {Promise<Array<Object>>} MongoDB bulk write operations.
 * @throws {AppError} Throws error when referenced academic entities cannot be found.
 */
const GradeWorkerHelper = async (student_ids, test_id, academic_year_id) => {
  // *************** START: Validate test reference ***************
  const test = await Tests.findById(test_id).lean()
  if (!test) {
    throw new AppError('Test not found', 'TEST_NOT_FOUND', 404)
  }
  // *************** END: Validate test reference ***************

  // *************** START: Validate subject reference ***************
  const subject = await Subjects.findById(test.subject_id).lean()
  if (!subject) {
    throw new AppError('Subject not found', 'SUBJECT_NOT_FOUND', 404)
  }
  // *************** END: Validate subject reference ***************

  // *************** START: Validate block reference ***************
  const block = await Blocks.findById(subject.block_id).lean()

  if (!block) {
    throw new AppError('Block not found', 'BLOCK_NOT_FOUND', 404)
  }
  // *************** END: Validate block reference ***************

  // *************** START: Fetch block academic data ***************
  const blockSubjects = await Subjects.find({
    block_id: block._id
  }).lean()

  const blockTests = await Tests.find({
    subject_id: {
      $in: blockSubjects.map((subject) => subject._id)
    }
  }).lean()

  const grades = await StudentGrades.find({
    student_id: {
      $in: student_ids
    },
    academic_year_id,
    test_id: {
      $in: blockTests.map((test) => test._id)
    }
  }).lean()
  // *************** END: Fetch block academic data ***************

  // *************** START: Generate academic standing operations ***************
  const operations = []
  const standings = []

  for (const studentId of student_ids) {
    const studentGrades = grades.filter((grade) => String(grade.student_id) === String(studentId))
    const subjectResults = []

    for (const currentSubject of blockSubjects) {
      const tests = blockTests.filter(
        (test) => String(test.subject_id) === String(currentSubject._id)
      )
      const testResults = []

      for (const test of tests) {
        const grade = studentGrades.find((grade) => String(grade.test_id) === String(test._id))
        if (!grade) continue
        const status = evaluateGradingRules(grade.score, test.grading_rules)
        testResults.push({
          test_id: test._id,
          total_mark: grade.score,
          test_status: status
        })
      }

      const subjectAverage = calculateAverage(testResults.map((test) => test.total_mark))
      const subjectStatus = evaluateGradingRules(subjectAverage, currentSubject.grading_rules)
      subjectResults.push({
        subject_id: currentSubject._id,
        subject_average: subjectAverage,
        subject_status: subjectStatus,
        tests: testResults
      })
    }

    const blockAverage = calculateAverage(subjectResults.map((subject) => subject.subject_average))
    const blockStatus = evaluateGradingRules(blockAverage, block.grading_rules)

    operations.push({
      updateOne: {
        filter: {
          student_id: studentId,
          academic_year_id,
          block_id: block._id
        },
        update: {
          $set: {
            student_id: studentId,
            academic_year_id,
            block_id: block._id,
            block_average: blockAverage,
            block_status: blockStatus,
            subjects: subjectResults
          }
        },
        upsert: true
      }
    })

    standings.push({
      student_id: studentId,
      academic_year_id,
      block_id: block._id,
      block_average: blockAverage,
      block_status: blockStatus,
      subjects: subjectResults
    })
  }
  // *************** END: Generate academic standing operations ***************

  return { operations, standings }
}

// *************** EXPORT MODULE ***************
export { GradeWorkerHelper }
