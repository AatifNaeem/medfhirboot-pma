import React from 'react';
import { Edit2 } from "lucide-react";

const PatientCard = ({ patient, onEdit }) => {
    const name = patient.name?.[0];
    const fullName = name
        ? `${name.given?.join(" ") ?? ""} ${name.family ?? ""}`.trim()
        : "unknown";

    // Pick the FIRST phone telecom entry (FHIR-safe)
    const phone = patient.telecom
        ?.filter(t => t.system === "phone")
        ?.at(0)?.value;

    return (
        <div className="flex justify-between items-center rounded-lg border p-4 shadow-sm">

            {/* Left: Patient Info */}
            <div className="flex flex-col gap-1">
                <div className="font-medium text-lg text-primary-content">
                    {fullName}
                    {phone && (
                        <span className="text-sm text-gray-500">
                            &nbsp;- {phone}
                        </span>
                    )}
                </div>

                <div className="text-sm">
                    <span className='font-semibold text-neutral'>Gender: </span>
                    <span className='text-gray-700'>{patient.gender ?? "unknown"}</span>
                </div>

                <div className="text-sm">
                    <span className='font-semibold text-neutral'>Date of Birth: </span>
                    <span className='text-gray-700'>{patient.birthDate ?? "unknown"}</span>
                </div>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEdit(patient)}
                    className="font-semibold btn btn-sm btn-square btn-outline btn-outline-neutral text-neutral text-center"
                    aria-label="Edit Patient"
                >
                    <Edit2 size={14} />
                </button>

                {/* Add more icons here if needed, e.g., delete */}
            </div>
        </div>
    );
};

export default PatientCard