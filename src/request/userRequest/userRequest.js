import api from "../api";

async function ajouterUser(data) {
    try {
        const response = await api.post('/user/ajouter-user', data);
        return response;
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        throw error;
    }
}

async function listeUser(currentPage) {
    try {
        const response = await api.get(`/user/liste-user?page=${currentPage}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de la liste des utilisateurs:", error);
        throw error;
    }
}

async function supprimerUser(id) {
    try {
        const response = await api.delete(`/user/supprimer-user/${id}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        throw error;
    }
}

async function updateUser(data) {
    try {
        const response = await api.put('/user/update-user', data);
        return response;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        throw error;
    }
}

async function userSearch(data) {
    try {
        const response = await api.get(`/user/search-user?search=${data}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la recherche d'utilisateur:", error);
        throw error;
    }
}

async function searchUserNext(page, data) {
    try {
        const response = await api.get(`/user/search-next-page?search=${data}&page=${page}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de la page suivante des utilisateurs:", error);
        throw error;
    }
}

async function listeTousUsersNonPagine() {
    try {
        const response = await api.get(`/user/all-users`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
}


async function getInfoUser(id) {
    try {
        const response = await api.get(`/user/get-info-user/?idUser=${id}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
}

async function getEtablissemntUser(id) {
    try {
        const response = await api.get(`/user/get-etablissement-user/?idUser=${id}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
}

export default async function getRoleUsers(id) {
    try {
        const response = await api.get(`/user/get-role-user/?idUser=${id}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
}

async function listeRoles(id) {
    try {
        const response = await api.get(`/user/get-role-user-not-added/?idUser=${id}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
}


async function ajouterRoleUser(data) {
    try {
      const response = await api.post(`/user/ajouter-role`, data);
  
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de rôle à l'utilisateur:", error);
      throw error;
    }
  }


async function deleteRoleUser(data) {
    try {
        const response = await api.post(`/user/delete-role-role`,data);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
}

async function deleteEtablissementUser(id) {
    try {
        const response = await api.delete(`/user/delete-etablissement-user/?idEtablissement=${id}`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
}


async function getInfoUserAuth() {
    try {
        const response = await api.get('/user/get-info-user-connect',);
        return response;
    } catch (error) {
        console.log(error);
    }
}


async function listeTousUsersNonPagineAndNotEtablissement() {
    try {
        const response = await api.get(`/user/all-usersnot-etablissement`);
        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération de tous les utilisateurs:", error);
        throw error;
    }
}


export {
    listeTousUsersNonPagine,
    searchUserNext,
    getInfoUserAuth,
    deleteEtablissementUser,
    ajouterUser,
    ajouterRoleUser,
    listeRoles,
    getEtablissemntUser,
    getInfoUser,
    deleteRoleUser,
    userSearch,
    updateUser,
    supprimerUser,
    listeUser,
    listeTousUsersNonPagineAndNotEtablissement
};
