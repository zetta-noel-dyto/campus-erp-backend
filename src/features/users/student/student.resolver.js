import { CreateStudentSchema } from "./student.validator.js";
import { CreateStudentHelper } from "./student.helper.js";
import { NormalizeGqlError } from "../../../core/error.js";
import { ValidateInput } from "../../academic/curriculum/curriculum.validator.js";

const CreateStudent = async (_, { input }) => {
    try {
        const data = ValidateInput(CreateStudentSchema, input);
        return await CreateStudentHelper(data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

const resolver = {
    Mutation: {
        CreateStudent
    }
}

export {
    resolver
}