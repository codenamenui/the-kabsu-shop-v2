"use client";

import React, { useState, ChangeEvent } from "react";
import SelectComponent from "@/components/SelectComponent";
import { colleges } from "@/data/profiledata";
import FormInput from "@/components/ProfileInputComponent";
import { createProfile } from "@/app/(newprofile)/new-profile/actions";
import { useRouter } from "next/navigation";

const NewProfile = () => {
    const [studNumber, setStudNumber] = useState("");
    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState<number>(-1);
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [studYear, setStudYear] = useState<string>("");
    const router = useRouter(); // Initialize the routSSer

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        if (selectedCollege < -1 || selectedCollege >= colleges.length) {
            return;
        }
        const college = colleges[selectedCollege].name;
        const profileData = {
            studNumber,
            fname,
            lname,
            mname,
            college,
            selectedProgram,
            studYear,
        };
        const { status } = await createProfile(profileData);
        if (status == 201) {
            router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
        } else if (status == 500) {
            setSubmitting(false);
        }
    };

    const handleCollegeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const collegeId = parseInt(event.target.value);
        setSelectedCollege(collegeId);
        setSelectedProgram(""); // Reset the program when the college changes
    };

    const handleProgramChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedProgram(event.target.value);
    };

    const handleStudYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setStudYear(event.target.value);
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-center h-screen w-screen"
            >
                <div className="flex flex-col justify-center bg-[#ededed] border border-gray-300 rounded-lg shadow-lg p-4 w-3/12">
                    <h1 className="title text-center">Profile Information</h1>

                    <FormInput
                        label="Student Number"
                        type="text"
                        name="stud_number"
                        id="stud_number"
                        value={studNumber}
                        placeholder="Enter student number..."
                        onChange={(e) => setStudNumber(e.target.value)}
                    />

                    <FormInput
                        label="First Name"
                        type="text"
                        name="fname"
                        id="fname"
                        value={fname}
                        placeholder="Enter first name..."
                        onChange={(e) => setFname(e.target.value)}
                    />

                    <FormInput
                        label="Middle Name"
                        type="text"
                        name="mname"
                        id="mname"
                        value={mname}
                        placeholder="Enter middle name..."
                        onChange={(e) => setMname(e.target.value)}
                    />

                    <FormInput
                        label="Last Name"
                        type="text"
                        name="lname"
                        id="lname"
                        value={lname}
                        placeholder="Enter last name..."
                        onChange={(e) => setLname(e.target.value)}
                    />

                    <SelectComponent
                        selectedCollege={selectedCollege}
                        selectedProgram={selectedProgram}
                        stud_year={studYear}
                        handleCollegeChange={handleCollegeChange}
                        handleProgramChange={handleProgramChange}
                        handleStudYearChange={handleStudYearChange}
                    />

                    <button type="submit" className="button-outline mt-5">
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewProfile;
