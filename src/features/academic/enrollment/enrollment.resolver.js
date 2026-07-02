import { EnrollStudentsSchema } from "./enrollment.validator.js";
import { ValidateInput } from "../curriculum/curriculum.validator.js";
import { NormalizeGqlError } from "../../../core/error.js";
import { EnrollStudentHelper } from "./enrollment.helper.js";

const EnrollStudentsToYear = async (_, { input }) => {
    try {
        const data = ValidateInput(EnrollStudentsSchema, input);
        return await EnrollStudentHelper(data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

const resolver = {
    Mutation: {
        EnrollStudentsToYear
    }
}

export {
    resolver
}