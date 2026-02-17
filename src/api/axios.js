import axios from "axios";

const api = axios.create({
    // baseURL: "https://hapi.fhir.org/baseR4"
    baseURL: "https://fhir-bootcamp.medblocks.com/fhir"
});

export default api;
