import api from "../api";

async function ajouterGroupe(data) {
    const response = await api.post('/groupe/ajouter-groupe', data);
    return response;
}

async function listeGroupe(currentPage) {
    const response = await api.get(`/groupe/liste-groupe?page=${currentPage}`);
    return response;
}

async function supprimerGroupe(data) {
    const response = await api.delete(`/groupe/supprimer-groupe/${data}`);
    return response;
}

async function updateGroupe(data) {
    const response = await api.put('/groupe/update-groupe', data);
    return response;
}

async function searchGroupeNext(page, data) {
    const response = await api.get(`/groupe/search-next-page?search=${data}&page=${page}`);
    return response;
}

async function getInfoGroupesTotatles() {
    const response = await api.get(`/groupe/get-groupe-totale`);
    return response;
}

async function getFormateurGroupe(id) {
    const response = await api.get(`/groupe/get-formateur-groupe?idGroupe=${id}`);
    return response;
}

// Updated functions to replace "formateur" with "filiere"
async function listeTousModuleNonPagineGroupe(id) {
    const response = await api.get(`/groupe/all-modules-groupe/?groupe=${id}`);
    return response;
}

async function modulesGroupeDisponible(id) {
    const response = await api.get(`/groupe/modules-groupe-disponible/?id=${id}`);
    return response;
}
async function getInfoGroupe(id) {
    const response = await api.get(`/groupe/getinfos-groupe/?id=${id}`);
    return response;
}


async function ajouterModuleGroupe(data) {
    const response = await api.post(`/groupe/ajouter-module-groupe/`, data);
    return response;
}

async function deleteModuleGroupe(data) {
    const response = await api.post(`/groupe/supprimer-module-groupe/`, data);
    return response;
}





export {
    getFormateurGroupe,
    ajouterModuleGroupe,
    getInfoGroupesTotatles,
    ajouterGroupe,
    getInfoGroupe,
    deleteModuleGroupe,
    listeTousModuleNonPagineGroupe,
    listeGroupe,
    supprimerGroupe,
    updateGroupe,
    modulesGroupeDisponible,
    searchGroupeNext,
};
