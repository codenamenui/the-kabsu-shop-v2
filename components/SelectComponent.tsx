import React, { ChangeEvent } from "react";
import { colleges, programs } from "@/data/profiledata";

const SelectComponent = ({
    selectedCollege,
    selectedProgram,
    stud_year,
    handleCollegeChange,
    handleProgramChange,
    handleStudYearChange,
}: {
    selectedCollege: number;
    selectedProgram: string;
    stud_year: string;
    handleCollegeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleProgramChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    handleStudYearChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) => {
    // Filter the programs based on the selected college
    const filteredPrograms = programs.filter(
        (program) => program.collegeId === selectedCollege
    );

    return (
        <div className="flex flex-col gap-2">
            <div>
                <label htmlFor="college">College: </label>
                <select
                    name="college"
                    id="college"
                    value={selectedCollege}
                    onChange={handleCollegeChange}
                    className="dropdown"
                    required
                >
                    <option value=""></option>
                    {colleges.map((college) => (
                        <option key={college.id} value={college.id}>
                            {college.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="program">Program: </label>
                <select
                    id="program"
                    name="program"
                    value={selectedProgram}
                    onChange={handleProgramChange}
                    className="dropdown"
                    required
                >
                    <option value=""></option>
                    {filteredPrograms.map((program) => (
                        <option key={program.id} value={program.name}>
                            {program.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="stud_year">Select School Year: </label>
                <select
                    id="stud_year"
                    name="stud_year"
                    value={stud_year}
                    onChange={handleStudYearChange}
                    required
                    className="dropdown"
                >
                    <option value=""></option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
            </div>
        </div>
    );
};

export default SelectComponent;
