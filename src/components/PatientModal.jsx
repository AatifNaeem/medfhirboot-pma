import React from 'react';
import { useState, useEffect } from 'react';

const PatientModal = ({ isOpen, onClose, onSubmit, patient }) => {
    const [givenName, setGivenName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [gender, setGender] = useState("unknown");
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Populate fields when modal opens (edit) or reset to empty (add)
    useEffect(() => {
        if (!isOpen) return;
        setErrors({});
        if (patient) {
            setGivenName(patient.name?.[0]?.given?.join(" ") ?? "");
            setFamilyName(patient.name?.[0]?.family ?? "");
            setGender(patient.gender ?? "unknown");
            setDob(patient.birthDate ?? "");
            setPhone(patient.telecom?.find(t => t.system === "phone")?.value ?? "");
        } else {
            setGivenName("");
            setFamilyName("");
            setGender("unknown");
            setDob("");
            setPhone("");
        }
    }, [patient, isOpen]);

    useEffect(() => {
        setErrors({});
    }, [givenName, familyName, gender, dob, phone]);

    const validatePatient = () => {
        const newErrors = {};

        // Name validation
        if (!givenName.trim() && !familyName.trim()) {
            newErrors.name = "At least a given name or family name is required.";
        }

        // Gender validation (FHIR enum)
        const allowedGenders = ["male", "female", "other", "unknown"];
        if (!allowedGenders.includes(gender)) {
            newErrors.gender = "Invalid gender value.";
        }

        // DOB validation
        if (dob) {
            const date = new Date(dob);
            if (isNaN(date.getTime())) {
                newErrors.dob = "Invalid date format.";
            } else if (date > new Date()) {
                newErrors.dob = "Date of birth cannot be in the future.";
            }
        }

        // Phone validation (simple, permissive)
        if (phone && !/^[0-9+\-()\s]{6,20}$/.test(phone)) {
            newErrors.phone = "Invalid phone number format.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePatient()) return;

        const payload = {
            resourceType: "Patient",
            name: [{ given: givenName.split(" "), family: familyName }],
            gender,
            birthDate: dob,
            telecom: phone ? [{ system: "phone", value: phone }] : [],
        };
        if (patient) {
            payload.id = patient.id;
        }
        setSubmitting(true);
        try {
            await onSubmit(payload);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                {submitting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral/30 border-t-neutral" />
                    </div>
                )}
                <h2 className="font-semibold text-2xl text-neutral mb-2">
                    {patient ? "Update Patient" : "Add Patient"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <fieldset disabled={submitting} className="disabled:opacity-70">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Given Name</span>
                            </label>
                            <input
                                type="text"
                                name="givenName"
                                value={givenName}
                                onChange={e => setGivenName(e.target.value)}
                                placeholder="Given Name"
                                className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Family Name</span>
                            </label>
                            <input
                                type="text"
                                name="familyName"
                                value={familyName}
                                onChange={e => setFamilyName(e.target.value)}
                                placeholder="Family Name"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Gender</span>
                            </label>
                            <select
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                                className={`select select-bordered w-full ${errors.gender ? "select-error" : ""}`}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="unknown">Unknown</option>
                            </select>
                            {errors.gender && (
                                <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Date Of Birth</span>
                            </label>
                            <input
                                type="date"
                                name="dob"
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                                className={`input input-bordered w-full ${errors.dob ? "input-error" : ""}`}
                            />
                            {errors.dob && (
                                <p className="text-sm text-red-500 mt-1">{errors.dob}</p>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone Number</span>
                            </label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className={`input input-bordered w-full ${errors.phone ? "input-error" : ""}`}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="btn btn-sm btn-outline btn-outline-neutral text-gray-700 disabled:opacity-70"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-sm btn-neutral text-white disabled:opacity-70"
                            >
                                {patient ? "Update" : "Create"}
                            </button>
                        </div>
                    </fieldset>
                </form>

            </div>
        </div>
    )
}

export default PatientModal;