import React from 'react';
import './admin1.css';
import Logo from '../../assets/E-Emplois. (2)_prev_ui.svg';

export default function AdminPage() {
  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <header className="admin-header">
          <img src={Logo} alt="Logo E-Emplois" className="admin-logo" />
          <div>
            <h1>Bienvenue, Administrateur !</h1>
            <p>Accédez à votre tableau de bord E-Emplois</p>
          </div>
        </header>
        <main className="admin-content">
          <div className="admin-cards">
            <AdminCard
              title="Gérer les Établissements"
              description="Ajouter, modifier ou supprimer des établissements."
            />
            <AdminCard
              title="Gérer les Directeurs"
              description="Ajouter, modifier ou supprimer des directeurs."
            />
            <AdminCard
              title="Surveillance des Activités"
              description="Surveiller les activités récentes sur la plateforme."
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminCard({ title, description }) {
  return (
    <div className="admin-card">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
