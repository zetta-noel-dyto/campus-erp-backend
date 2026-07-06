import DataLoader from "dataloader";
import { AcademicYearModel } from "../features/academic/enrollment/academic_year.model.js";

const batchAcademicYears = async (academic_year_ids) => {
    const academicYears = await AcademicYearModel.find({ _id: { $in: academic_year_ids } }).lean();

    const academicYearsMap = new Map();
    academicYears.forEach((academicYear) => {
        academicYearsMap.set(String(academicYear._id), academicYear);
    })

    return academic_year_ids.map((id) => academicYearsMap.get(String(id)) ?? null);
}

const CreateAcademicYearLoader = () => {
    return new DataLoader(batchAcademicYears);
}

export {
    CreateAcademicYearLoader
}