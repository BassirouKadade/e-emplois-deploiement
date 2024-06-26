import api from "../api";

async function ajouterFormateur(data) {
        const response = await api.post('/formateur/ajouter-formateur', data);
        return response;
}

async function listeFormateur(currentPage) {
        const response = await api.get(`/formateur/liste-formateur?page=${currentPage}`);
        return response;
}

async function supprimerformateur(data) {
        const response = await api.delete(`/formateur/supprimer-formateur/${data}`);
        return response;
}

async function updateformateur(data) {
        const response = await api.put('/formateur/update-formateur',data);
        return response;
}

async function formateurSearch(data) {
        const response = await api.get(`/formateur/search-formateur?search=${data}`);
        return response;
}

async function searchFormateurNext(page,data) {
        const response = await api.get(`/formateur/search-next-page?search=${data}&page=${page}`);
        return response;
    }

async function listeTousFormateurNonPagine() {
        const response = await api.get(`/formateur/all-formateurs`);
        return response;
    }
  
    async function getModulesFormateur(id) {
        const response = await api.get(`/module/modules-formateur/?id=${id}`);
        return response;
    }

//     ********* Pasrealsier
 

    async function     ajouterMGroupeFormateur(data) {
        const response = await api.post(`/formateur/add-groupe-formateur/`,data);
        return response;
    }

    async function getGroupesFormateur(id) {
        const response = await api.get(`/formateur/groupe-formateur/?id=${id}`);
        return response;
    }

     async function getGroupesNonInclusFormateur(id) {
        const response = await api.get(`/formateur/getGroupesNonInclusFormateur/?idFormateur=${id}`);
        return response;
    }
  async function deleteGroupeFormateur(data) {
        const response = await api.post(`/formateur/supprimer-groupe-formateur/`,data);
        return response;
    }

    

export {getGroupesFormateur,deleteGroupeFormateur,getGroupesNonInclusFormateur, ajouterMGroupeFormateur ,getModulesFormateur,listeTousFormateurNonPagine,searchFormateurNext,ajouterFormateur,formateurSearch, updateformateur,supprimerformateur,listeFormateur};
