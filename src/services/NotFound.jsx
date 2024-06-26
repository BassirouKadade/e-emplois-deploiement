// NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './notfound.css'; // Assurez-vous de créer ce fichier CSS
import { Helmet } from 'react-helmet';
const NotFound = () => {
  return (
    <div className="not-found">
       <Helmet>
        <title>Not Found | E-Emplois</title>
        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <h1>404 - Page non trouvée</h1>
      <p>Désolé, la page que vous recherchez pourrait avoir été supprimée ou n'existe pas.</p>
      <Link to="/dashboard" className="back-link">Retour à l'accueil</Link>
      {/* Vous pouvez ajouter une illustration ici si nécessaire */}
      {/* <img src="/path/to/illustration.jpg" alt="Illustration" className="illustration" /> */}
    </div>
  );
};

export default NotFound;
