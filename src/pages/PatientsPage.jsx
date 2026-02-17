import api from '../api/axios';
import { Plus } from "lucide-react";
import Loader from '../components/Loader';
import Search from '../components/Search';
import { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import PatientCard from '../components/PatientCard';
import PatientModal from '../components/PatientModal';
import { notifySuccess, notifyError } from "../utils/toast";

const PatientsPage = () => {
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const [offsetTo, setOffsetTo] = useState(0);
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");

    const openPatientModal = (patient = null) => {
        setEditingPatient(patient);
        setModalOpen(true);
    };

    const closePatientModal = () => {
        setModalOpen(false);
        setEditingPatient(null);
    };

    const getPatients = async (url = "/Patient?_count=20&_offset=0&_sort=-_lastUpdated&_total=accurate") => {
        console.log(url);
        setLoading(true);
        try {
            // Get Patients
            const response = await api.get(url);
            if (response.status === 200) {
                const entries = response.data.entry || [];
                const patientResources = entries
                    .map(e => e.resource)
                    .filter(r => r.resourceType === "Patient");
                setPatients(patientResources);

                // Extract pagination links
                const links = response.data.link || [];
                setNextUrl(links.find(l => l.relation === "next")?.url ?? null);
                setPrevUrl(links.find(l => l.relation === "previous")?.url ?? null);

                // Get Offset, OffsetTo and Total
                const offsetVal = (Number(new URL(url, window.location.origin).searchParams.get("_offset") ?? 0));
                const totalVal = response.data.total;
                const offsetToVal = ((offsetVal + 20) < totalVal) ? offsetVal + 20 : totalVal;
                setOffset(offsetVal);
                setOffsetTo(offsetToVal);
                setTotal(totalVal);
            } else {
                notifyError("Unable to get patients.");
            }
        } catch (err) {
            notifyError("Unable to get patients.");
        } finally {
            setLoading(false);
        }
    };

    const submitPatient = async (payload) => {
        try {
            if (editingPatient) {
                // Update existing patient
                const response = await api.put(`/Patient/${editingPatient.id}`, payload);
                if (response.status === 200) {
                    notifySuccess("Patient updated.");
                } else {
                    notifyError("Unable to update patient.");
                }
            } else {
                // Create new patient
                const response = await api.post("/Patient", payload);
                if (response.status === 201) {
                    notifySuccess("Patient created.");
                } else {
                    notifyError("Unable to create patient.");
                }
            }

            closePatientModal();
            setSearchName("");
            setSearchPhone("");
            getPatients();
        } catch (err) {
            notifyError("Unable to save patient.");
        }
    };

    const editPatient = (patient) => {
        setEditingPatient(patient);
        setModalOpen(true);
    };

    const searchPatient = () => {
        if (searchName.trim() && searchPhone.trim()) {
            const firstSpaceIndex = searchName.trim().indexOf(" ");
            if (firstSpaceIndex === -1) {
                getPatients(`/Patient?_count=20&_offset=0&_sort=-_lastUpdated&_total=accurate&name=${searchName.trim()}&phone=${searchPhone.trim()}`);
            } else {
                const givenName = searchName.trim().slice(0, firstSpaceIndex);
                const familyName = searchName.trim().slice(firstSpaceIndex + 1);
                getPatients(`/Patient?_count=20&_offset=0&_sort=-_lastUpdated&_total=accurate&given=${givenName}&family=${familyName}phone=${searchPhone.trim()}`);
            }
        } else if (searchName.trim()) {
            const firstSpaceIndex = searchName.trim().indexOf(" ");
            if (firstSpaceIndex === -1) {
                getPatients(`/Patient?_count=20&_offset=0&_sort=-_lastUpdated&_total=accurate&name=${searchName.trim()}`);
            } else {
                const givenName = searchName.trim().slice(0, firstSpaceIndex);
                const familyName = searchName.trim().slice(firstSpaceIndex + 1);
                getPatients(`/Patient?_count=20&_offset=0&_sort=-_lastUpdated&_total=accurate&given=${givenName}&family=${familyName}`);
            }
        } else if (searchPhone.trim()) {
            getPatients(`/Patient?_count=20&_offset=0&_sort=-_lastUpdated&_total=accurate&phone=${searchPhone.trim()}`);
        }
    };

    const resetSearch = () => {
        setSearchName("");
        setSearchPhone("");
        getPatients();
    };

    useEffect(() => {
        getPatients();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <PatientModal
                isOpen={modalOpen}
                onClose={closePatientModal}
                onSubmit={submitPatient}
                patient={editingPatient}
            />

            <div className="p-4">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="font-semibold items-center text-3xl text-neutral">Patients</h2>

                    <button
                        onClick={() => openPatientModal(null)}
                        className="flex items-center btn btn-sm btn-neutral"
                        aria-label="Add Patient"
                    >
                        <Plus className="text-white" size={14} />
                        <span className="text-sm text-white">Add Patient</span>
                    </button>
                </div>


                <div className="flex items-center justify-between mb-3 gap-3">
                    <Search
                        searchName={searchName}
                        setSearchName={setSearchName}
                        searchPhone={searchPhone}
                        setSearchPhone={setSearchPhone}
                        onSearch={searchPatient}
                        onReset={resetSearch}
                    />
                    {patients.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Pagination
                                offset={offset}
                                offsetTo={offsetTo}
                                total={total}
                                prevUrl={prevUrl}
                                nextUrl={nextUrl}
                                onPageChange={getPatients}
                            />
                        </div>
                    )}
                </div>

                {patients.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center mt-12">
                        <p className="text-gray-500">No patients found.</p>
                    </div>
                ) : (
                    <div>
                        <div className="space-y-3">
                            {patients.map(patient => (
                                <PatientCard key={patient.id} patient={patient} onEdit={editPatient} />
                            ))}
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-4 mb-4">
                            <Pagination
                                offset={offset}
                                offsetTo={offsetTo}
                                total={total}
                                prevUrl={prevUrl}
                                nextUrl={nextUrl}
                                onPageChange={getPatients}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientsPage;