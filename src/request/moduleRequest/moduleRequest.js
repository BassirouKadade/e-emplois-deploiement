import api from "../api";

async function ajouterModule(data) {
    const response = await api.post('/module/ajouter-module', data);
    return response;
}

async function listeModule(currentPage) {
    const response = await api.get(`/module/liste-module?page=${currentPage}`);
    return response;
}

async function supprimerModule(data) {
    const response = await api.delete(`/module/supprimer-module/${data}`);
    return response;
}

async function updateModule(data) {
    const response = await api.put('/module/update-module', data);
    return response;
}

async function moduleSearch(data) {
    const response = await api.get(`/module/search-module?search=${data}`);
    return response;
}

async function searchModuleNext(page, data) {
    const response = await api.get(`/module/search-next-page?search=${data}&page=${page}`);
    return response;
}

async function listeTousModuleNonPagine(id) {
    const response = await api.get(`/module/all-modules/?formateur=${id}`);
    return response;
}



async function ajouterModuleFormateur(data) {
    const response = await api.post(`/module/ajouter-module-formateur/`,data);
    return response;
}

async function deleteModuleFormateur(data) {
    const response = await api.post(`/module/supprimer-module-formateur/`,data);
    return response;
}

async function getInfosFormateur(id) {
    const response = await api.get(`/module/getinfos-formateur/?id=${id}`);
    return response;
}

async function getModulesGroupe(id) {
    const response = await api.get(`/module/get-module-groupe/?idGroupe=${id}`);
    return response;
}

export {getModulesGroupe, getInfosFormateur,deleteModuleFormateur,ajouterModuleFormateur, listeTousModuleNonPagine, searchModuleNext, ajouterModule, moduleSearch, updateModule, supprimerModule, listeModule };
