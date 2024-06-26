import { AES } from 'crypto-js';
import encUtf8 from 'crypto-js/enc-utf8'; // Assurez-vous d'importer correctement l'encodage UTF-8
import { jwtDecode } from "jwt-decode";
import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_SECRET_KEY;

/**
 * Récupère une valeur chiffrée depuis localStorage et la déchiffre.
 * @param {string} key - La clé pour l'entrée dans localStorage.
 * @param {*} initialValue - Valeur par défaut si aucune valeur n'est trouvée.
 * @returns {*} La valeur déchiffrée ou initialValue si aucune valeur n'est trouvée.
 */
const getSecureLocalStorageItem = (key, initialValue = null) => {
  try {
    const encryptedItem = window.localStorage.getItem(key);
    if (encryptedItem) {
      const bytes = AES.decrypt(encryptedItem, secretKey);
      const decryptedValue = bytes.toString(encUtf8); // Utilisation de l'encodage UTF-8 pour décoder
      return JSON.parse(decryptedValue);
    }
    return initialValue;
  } catch (error) {
    console.error(`Erreur lors du parsing de l'élément localStorage : ${key}`, error);
    return initialValue;
  }
};

/**
 * Stocke une valeur chiffrée dans localStorage.
 * @param {string} key - La clé pour l'entrée dans localStorage.
 * @param {*} value - La valeur à chiffrer et à stocker.
 */
const setSecureLocalStorageItem = (key, value) => {
  try {
    const encryptedValue = AES.encrypt(JSON.stringify(value), secretKey).toString();
    window.localStorage.setItem(key, encryptedValue);
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement dans localStorage : ${key}`, error);
  }
};

// Fonction pour décoder un token JWT
const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

const handleLogout = () => {
  localStorage.removeItem('_data_user_');
  // Autres actions après la déconnexion
};


// Fonction de chiffrement
function chiffrement(chaine, cle) {
  if (!chaine || !cle) {
      return ''; // Gestion des cas où chaine ou cle sont null ou undefined
  }
  let chiffree = '';
  for (let i = 0; i < chaine.length; i++) {
      let charCode = chaine.charCodeAt(i);
      // Appliquer la clé de chiffrement
      let chiffreCharCode = charCode + cle.charCodeAt(i % cle.length); // Utilisation d'une partie de la clé pour le chiffrement
      chiffree += String.fromCharCode(chiffreCharCode);
  }
  return chiffree;
}

// Fonction de déchiffrement
function dechiffrement(chiffree, cle) {
  if (!chiffree || !cle) {
      return ''; // Gestion des cas où chiffree ou cle sont null ou undefined
  }
  let claire = '';
  for (let i = 0; i < chiffree.length; i++) {
      let charCode = chiffree.charCodeAt(i);
      // Appliquer la clé de déchiffrement (inverse de la clé de chiffrement)
      let clairCharCode = charCode - cle.charCodeAt(i % cle.length); // Utilisation d'une partie de la clé pour le déchiffrement
      claire += String.fromCharCode(clairCharCode);
  }
  return claire;
}

// Clé de chiffrement utilisée pour localStorage
const cleLocalStorage = ';Bacho1234';

// Fonction pour obtenir l'email déchiffré depuis localStorage
function getEmail() {
  let encryptedEmail = localStorage.getItem('user_email'); // Récupérer l'email chiffré depuis le localStorage
  if (!encryptedEmail) {
      return ''; // Gérer le cas où aucun email n'est trouvé dans le localStorage
  }
  return dechiffrement(encryptedEmail, cleLocalStorage);
}

// Fonction pour définir l'email chiffré dans le localStorage
function setEmail(email) {
  if (!email) {
      return; // Gérer le cas où aucun email n'est passé à la fonction
  }
  let encryptedEmail = chiffrement(email, cleLocalStorage); // Chiffrer l'email
  localStorage.setItem('user_email', encryptedEmail); // Stocker l'email chiffré dans le localStorage
}



export {handleLogout,getEmail, setEmail , getSecureLocalStorageItem, decodeToken, setSecureLocalStorageItem };
