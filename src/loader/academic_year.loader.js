// *************** IMPORT LIBRARY ***************
import DataLoader from 'dataloader';
import mongoose from 'mongoose';

// *************** IMPORT MODULE ***************
import { AcademicYearModel } from '../features/academic/enrollment/academic_year.model.js';

/**
 * Batch function for DataLoader to resolve AcademicYear documents.
 * Implements request-level batching to eliminate N+1 query problems
 * when resolving Student.academic_years fields in GraphQL.
 * @param {Array<string>} keys - Array of AcademicYear ObjectId strings
 * @returns {Promise<Array<object|null>>} Ordered list of AcademicYear documents
 * matching input keys (null if not found)
 */
const batchAcademicYears = async (keys) => {
  // *************** START: Deduplicate and normalize keys ***************
  const uniqueKeys = [...new Set(keys.map((key) => String(key)))].map((id) => new mongoose.Types.ObjectId(id));
  // *************** END: Deduplicate and normalize keys ***************

  // *************** START: Fetch academic years in single query ***************
  const academicYears = await AcademicYearModel.find({ _id: { $in: uniqueKeys } }).lean();
  // *************** END: Fetch academic years in single query ***************

  // *************** START: Map results for O(1) lookup ***************
  const academicYearsMap = new Map();

  academicYears.forEach((academicYear) => {
    academicYearsMap.set(String(academicYear._id), academicYear);
  });
  // *************** END: Map results for O(1) lookup ***************

  // *************** START: Maintain input order consistency ***************
  return keys.map((id) => academicYearsMap.get(String(id)) ?? null);
  // *************** END: Maintain input order consistency ***************
};

/**
 * Creates a new DataLoader instance for AcademicYear batching.
 * Must be instantiated per-request inside Apollo Server context
 * to avoid cross-request cache pollution.
 * @returns {DataLoader} New isolated DataLoader instance
 */
const CreateAcademicYearLoader = () => {
  return new DataLoader(batchAcademicYears);
};

// *************** EXPORT MODULE ***************
export { CreateAcademicYearLoader };
