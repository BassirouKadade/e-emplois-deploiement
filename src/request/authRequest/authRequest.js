import api from "../api";



/**
 * Logs in a user with the given data.
 * @param {Object} data - User login data.
 * @returns {Object} Response from the API.
 */
async function loginUser(data) {
    try {
        const response = await api.post('/auth/login', data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}


/**
 * Resets the user password with the given data.
 * @param {Object} data - Data required for resetting the password.
 * @returns {Object} Response from the API.
 */
async function resetUserPassword(data) {
    try {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}


/**
 * Handles errors by logging and rethrowing them.
 * @param {Error} error - The error object to handle.
 */
function handleError(error) {
    console.error('API call failed:', error);
    throw error;
}



/**
 * Logs in a user with the given data.
 * @param {Object} data - User login data.
 * @returns {Object} Response from the API.
 */
async function updateProfile(data) {
    try {
        const response = await api.post('/auth/update-profile', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        return response;
    } catch (error) {
        handleError(error);
    }
}


async function forgotPassword(data) {
    try {
        const response = await api.post('/auth/forgot-password', data);
        return response; // Retourner seulement les données de la réponse, pas toute la réponse
    } catch (error) {
        throw error.response.data; // Lancer l'erreur avec les données de la réponse d'erreur
    }
}


async function verifiy_user(data) {
    try {
        const response=await api.post('/auth/verifiy_user-otp',data)
        return response; // Retourner seulement les données de la réponse, pas toute la réponse
    } catch (error) {
        throw error.response.data; // Lancer l'erreur avec les données de la réponse d'erreur
    }
}
async function resendMemail_(data) {
    try {
        const response=await api.post('/auth/resendMemail',data)
        return response; // Retourner seulement les données de la réponse, pas toute la réponse
    } catch (error) {
        throw error.response.data; // Lancer l'erreur avec les données de la réponse d'erreur
    }
}



export {updateProfile,verifiy_user, resendMemail_,loginUser,forgotPassword, resetUserPassword };
