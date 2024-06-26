import React from 'react';
import { Link } from 'react-router-dom';
import './notfound.css'; // Assurez-vous de créer ce fichier CSS

const ServerError = () => {
  return (
    

<div className="not-found">
       <h1>500 - Erreur de serveur</h1>
      <p>Nous rencontrons actuellement des problèmes avec notre serveur. Veuillez réessayer plus tard.</p>
      <Link  className="back-link"> Actualiser la page</Link>
      {/* Vous pouvez ajouter une illustration ici si nécessaire */}
      {/* <img src="/path/to/illustration.jpg" alt="Illustration" className="illustration" /> */}
    </div>
  );
};

export default ServerError;
