import api from "../api";

async function ajouterEtablissement(data) {
    const response = await api.post('/etablissement/ajouter-etablissement', data);
    return response;
}

async function obtenirListeEtablissements(currentPage) {
    const response = await api.get(`/etablissement/liste-etablissement?page=${currentPage}`);
    return response;
}

async function supprimerEtablissement(data) {
    const response = await api.delete(`/etablissement/supprimer-etablissement/${data}`);
    return response;
}

export default async function mettreAJourEtablissement(data) {
    const response = await api.put('/etablissement/update-etablissement', data);
    return response;
}

async function rechercherEtablissementPageSuivante(page, data) {
    const response = await api.get(`/etablissement/search-next-page?search=${data}&page=${page}`);
    return response;
}

 async function listeEtablissmentAll() {
    try {
        const response = await api.get(`/etablissement/get-list-etablissement-all`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
}
export {
    ajouterEtablissement,
    obtenirListeEtablissements,
    supprimerEtablissement,
    rechercherEtablissementPageSuivante,
    listeEtablissmentAll
};
