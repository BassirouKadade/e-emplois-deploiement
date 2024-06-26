import api from "../api";

async function verificationSalleDisponible(data) {
    const response = await api.post('/emplois/verification-disponibilite-emplois', data);
    return response;
}

async function creerEmplois(data) {
    const response = await api.post('/emplois/creer-emplois', data);
    return response;
}

async function getEmploisGroupe(data) {
    const response = await api.get(`/emplois/get-emplois/?idGroupe=${data}`);
    return response;
}
// *************************GET EMPLOIS GROUPE PRIME 
// ************************************************

async function getEmploisGroupePrime(data) {
    const response = await api.get(`/emplois/get-emplois-groupe-prime/?idGroupe=${data}`);
    return response;
}
// **-----------------------------------------

async function getTotalMasseHoraireGroupe(data) {
    const response = await api.get(`/emplois/get-Totale-Masse-Horaire/?idGroupe=${data}`);
    return response;
}

async function getEmploisSalle(id) {
    const response = await api.get(`/emplois/get-emplois-salle/?idSalle=${id}`);
    return response;
}

// *************************GET EMPLOIS salle PRIME 
// ************************************************

async function getEmploisSallePrime(id) {
    const response = await api.get(`/emplois/get-emplois-salle-prime/?idSalle=${id}`);
    return response;
}
// **-----------------------------------------





async function getEmploisFormateur(id) {
    const response = await api.get(`/emplois/get-emplois-formateur/?idFormateur=${id}`);
    return response;
}

// *************************GET EMPLOIS frmateur PRIME 
// ************************************************

async function getEmploisFormateurPrime(id) {
    const response = await api.get(`/emplois/get-emplois-formateur-prime/?idFormateur=${id}`);
    return response;
}
// **-----------------------------------------




async function deleteSeanceReservation(id) {
    const response = await api.delete(`/emplois/delete-reservation-seance/?idReservation=${id}`);
    return response;
}

async function getTotalGroupeSalleFormateurEmplois(){
    const response = await api.get(`/emplois/get-total-groupe-salle-formateur`);
    return response;
}

async function getEmploisDay(day){
    const response = await api.get(`/emplois/get-emplois-day?day=${day}`);
    return response;
}

async function deleteSeanceReservationUpdate(id) {
    const response = await api.delete(`/emplois/delete-update-reservation-seance/?idReservation=${id}`);
    return response;
}

async function verificationFormateurDisponibleUpdate(id) {
    const response = await api.get(`/emplois/formaeur-disponible-update-seance/?idReservation=${id}`);
    return response;
}

async function updateEmploisFormateurChamp(id) {
    const response = await api.get(`/emplois/reservation-formateur-update-seance/?idReservation=${id}`);
    return response;
}

async function updateEmploisFormateurChampValid(data) {
    const response = await api.post(`/emplois/reservation-formateur-update-seance-valid`,data);
    return response;
}


async function updateEmploisSalleChamp(id) {
    const response = await api.get(`/emplois/reservation-salle-update-seance/?idReservation=${id}`);
    return response;
}


async function emploisupdateSaleValid(data) {
    const response = await api.post(`/emplois/reservation-salle-update-seance-valid`,data);
    return response;
}


async function getEmploisAllOFDATABASE(){
    const response = await api.get(`/emplois/get-emplois-of-database`);
    return response;
}




async function deleteSeanceReservationUpdateAndUpdate(id) {
    const response = await api.delete(`/emplois/delete-update-reservation-seance-and-delete/?idReservation=${id}`);
    return response;
}

async function getInfoEtablissement(){
    const response = await api.get(`/emplois/get-info-etabliseement-directeur`);
    return response;
}

async function reinitialisationEspaceEmploisFormateur(){
    const response = await api.get(`/emplois/reinitialisationEspaceEmploisFormateur`);
    return response;
}



export {
    getEmploisSalle,
    getEmploisDay,
    reinitialisationEspaceEmploisFormateur,
    getInfoEtablissement,
    updateEmploisSalleChamp,
    emploisupdateSaleValid,
    updateEmploisFormateurChamp,
    updateEmploisFormateurChampValid,
    verificationFormateurDisponibleUpdate,
    getTotalGroupeSalleFormateurEmplois,
    deleteSeanceReservation,
    getEmploisFormateur,
    deleteSeanceReservationUpdate,
    getTotalMasseHoraireGroupe,
    getEmploisGroupe,
    creerEmplois,
    verificationSalleDisponible,
    getEmploisAllOFDATABASE,
    deleteSeanceReservationUpdateAndUpdate,
    // ***
    getEmploisGroupePrime,
    getEmploisSallePrime,
    getEmploisFormateurPrime
};
