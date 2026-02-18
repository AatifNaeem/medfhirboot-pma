import React from 'react';
import { useState, useEffect } from 'react';

export const FHIR_SERVERS = [
    {
        id: 'hapi',
        name: 'HAPI FHIR R4 Server',
        baseURL: 'https://hapi.fhir.org/baseR4'
    },
    {
        id: 'medblocks',
        name: 'Medblocks FHIR Server',
        baseURL: 'https://fhir-bootcamp.medblocks.com/fhir'
    }
];

const SettingsModal = ({ isOpen, onClose, currentBaseURL, onServerChange }) => {
    const [selectedServer, setSelectedServer] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        // Find which server matches the current baseURL
        const currentServer = FHIR_SERVERS.find(server => server.baseURL === currentBaseURL);
        setSelectedServer(currentServer?.id || 'medblocks');
    }, [isOpen, currentBaseURL]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedServerData = FHIR_SERVERS.find(server => server.id === selectedServer);
        if (selectedServerData) {
            onServerChange(selectedServerData.baseURL);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 sm:px-0">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="font-semibold text-2xl text-neutral mb-4">
                    FHIR Server Settings
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text">Select FHIR Server</span>
                        </label>
                        <div className="space-y-2">
                            {FHIR_SERVERS.map(server => (
                                <label key={server.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="fhirServer"
                                        value={server.id}
                                        checked={selectedServer === server.id}
                                        onChange={(e) => setSelectedServer(e.target.value)}
                                        className={`radio radio-neutral ${selectedServer === server.id ? 'radio-neutral-selected' : ''}`}
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium">{server.name}</div>
                                        <div className="text-sm text-gray-500">{server.baseURL}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-sm btn-outline btn-outline-neutral text-gray-700 w-full sm:w-auto"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-sm btn-neutral text-white w-full sm:w-auto"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;
