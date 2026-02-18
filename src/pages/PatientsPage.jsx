import api, { updateBaseURL } from '../api/axios';
import { Plus, ChevronDown } from "lucide-react";
import Loader from '../components/Loader';
import Search from '../components/Search';
import { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import PatientCard from '../components/PatientCard';
import PatientModal from '../components/PatientModal';
import SettingsModal, { FHIR_SERVERS } from '../components/SettingsModal';
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

    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [currentBaseURL, setCurrentBaseURL] = useState(api.defaults.baseURL);

    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [pageSize, setPageSize] = useState(20);

    const buildPatientsUrl = ({ count = pageSize, offset = 0, name = searchName, phone = searchPhone } = {}) => {
        const params = new URLSearchParams();
        params.set("_count", String(count));
        params.set("_offset", String(offset));
        params.set("_sort", "-_lastUpdated");
        params.set("_total", "accurate");

        const nameTrim = name.trim();
        const phoneTrim = phone.trim();

        if (nameTrim && phoneTrim) {
            const firstSpaceIndex = nameTrim.indexOf(" ");
            if (firstSpaceIndex === -1) {
                params.set("name", nameTrim);
            } else {
                params.set("given", nameTrim.slice(0, firstSpaceIndex));
                params.set("family", nameTrim.slice(firstSpaceIndex + 1));
            }
            params.set("phone", phoneTrim);
        } else if (nameTrim) {
            const firstSpaceIndex = nameTrim.indexOf(" ");
            if (firstSpaceIndex === -1) {
                params.set("name", nameTrim);
            } else {
                params.set("given", nameTrim.slice(0, firstSpaceIndex));
                params.set("family", nameTrim.slice(firstSpaceIndex + 1));
            }
        } else if (phoneTrim) {
            params.set("phone", phoneTrim);
        }

        return `/Patient?${params.toString()}`;
    };

    const openPatientModal = (patient = null) => {
        setEditingPatient(patient);
        setModalOpen(true);
    };

    const closePatientModal = () => {
        setModalOpen(false);
        setEditingPatient(null);
    };

    const openSettingsModal = () => {
        setSettingsModalOpen(true);
    };

    const closeSettingsModal = () => {
        setSettingsModalOpen(false);
    };

    const handleServerChange = (newBaseURL) => {
        updateBaseURL(newBaseURL);
        setCurrentBaseURL(newBaseURL);
        // Reset search and reload patients with new server
        setSearchName("");
        setSearchPhone("");
        setOffset(0);
        getPatients(buildPatientsUrl({ offset: 0, name: "", phone: "" }));
        notifySuccess("FHIR server changed successfully.");
    };

    const getPatients = async (url) => {
        const requestUrl = url ?? buildPatientsUrl();
        console.log(requestUrl);
        setLoading(true);
        try {
            // Get Patients
            const response = await api.get(requestUrl);
            if (response.status === 200) {
                const entries = response.data.entry || [];
                const patientResources = entries
                    .map(e => e.resource)
                    .filter(r => r.resourceType === "Patient");
                setPatients(patientResources);

                // Extract pagination links
                const links = response.data.link || [];
                setNextUrl(links.find(l => l.relation === "next")?.url.replace(/^http:\/\//, 'https://') ?? null);
                setPrevUrl(links.find(l => l.relation === "previous")?.url.replace(/^http:\/\//, 'https://') ?? null);

                // Get Offset, OffsetTo and Total
                const offsetVal = (Number(new URL(requestUrl, window.location.origin).searchParams.get("_offset") ?? 0));
                const countParamVal = (Number(new URL(requestUrl, window.location.origin).searchParams.get("_count") ?? 0));
                const countVal = countParamVal || pageSize;
                const totalVal = response.data.total;
                const offsetToVal = ((offsetVal + countVal) < totalVal) ? offsetVal + countVal : totalVal;
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
            getPatients(buildPatientsUrl({ name: "", phone: "" }));
        } catch (err) {
            notifyError("Unable to save patient.");
        }
    };

    const editPatient = (patient) => {
        setEditingPatient(patient);
        setModalOpen(true);
    };

    const searchPatient = () => {
        getPatients(buildPatientsUrl({ offset: 0 }));
    };

    const resetSearch = () => {
        setSearchName("");
        setSearchPhone("");
        getPatients(buildPatientsUrl({ offset: 0, name: "", phone: "" }));
    };

    const handlePageSizeChange = (e) => {
        const newSize = Number(e.target.value);
        setPageSize(newSize);
        getPatients(buildPatientsUrl({ count: newSize, offset: 0 }));
    };

    const getCurrentServerName = () => {
        const currentServer = FHIR_SERVERS.find(server => server.baseURL === currentBaseURL);
        return currentServer?.name || 'Unknown Server';
    };

    useEffect(() => {
        // Initialize baseURL from localStorage
        const storedBaseURL = localStorage.getItem('fhirBaseURL') || api.defaults.baseURL;
        setCurrentBaseURL(storedBaseURL);
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

            <SettingsModal
                isOpen={settingsModalOpen}
                onClose={closeSettingsModal}
                currentBaseURL={currentBaseURL}
                onServerChange={handleServerChange}
            />

            <div className="p-4">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="font-semibold items-center text-2xl text-neutral">PATIENT MANAGEMENT</h2>

                    <div className="flex items-center space-x-2">
                        {/* Add Patient Button */}
                        <button
                            onClick={() => openPatientModal(null)}
                            className="flex items-center btn btn-sm btn-neutral"
                            aria-label="Add Patient"
                        >
                            <Plus className="text-white" size={16} />
                            <span className="text-sm text-white ml-1">Add Patient</span>
                        </button>

                        {/* Server Selection Button */}
                        <button
                            onClick={openSettingsModal}
                            className="flex items-center btn btn-sm btn-error"
                            aria-label="Change FHIR Server"
                        >
                            <span className="text-sm text-white">{getCurrentServerName()}</span>
                            <ChevronDown className="text-white ml-1" size={16} />
                        </button>
                    </div>
                </div>

                <div className="px-0 sm:px-12 lg:px-24">
                    {/* <div className="flex items-center justify-between mb-3 gap-3"> */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 gap-3">
                        <Search
                            searchName={searchName}
                            setSearchName={setSearchName}
                            searchPhone={searchPhone}
                            setSearchPhone={setSearchPhone}
                            onSearch={searchPatient}
                            onReset={resetSearch}
                        />
                        {patients.length > 0 && (
                            <div className="hidden lg:flex items-center gap-2">
                                <label className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">Page size</span>
                                    <select
                                        aria-label="Page size"
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                        className="select select-sm select-bordered"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </label>
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
                            <div className="flex items-center justify-start lg:justify-end gap-2 mt-3 mb-4">
                                <label className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">Page size</span>
                                    <select
                                        aria-label="Page size"
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                        className="select select-sm select-bordered"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </label>
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
        </div >
    );
}

export default PatientsPage;