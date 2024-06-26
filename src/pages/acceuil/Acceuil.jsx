import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Acceuil.css'; // Assurez-vous que ce chemin est correct
import Logo from '../../assets/Young man win the race.png';

export default function Acceuil() {
  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-brand">
          <span className="header__brand">E-<span className="header__brand-highlight">Emploi</span></span>
        </div>
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link className="nav-link" to="/login">Se connecter</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="admin-main">
        <section className="welcome-section">
          <div className="div1">
            <h1>Bienvenue sur E-Emploi</h1>
            <p>Créez facilement vos emplois du temps avec notre plateforme intuitive. E-Emploi vous permet de planifier efficacement les horaires de travail de vos équipes en quelques clics. Notre interface conviviale simplifie la gestion quotidienne en offrant des outils puissants pour personnaliser les plannings selon les besoins spécifiques de votre entreprise.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary">Commencez Maintenant</Link>
            </div>
          </div>
          <div className="div2">
            <img src={Logo} alt="Young man win the race" />
          </div>
        </section>
        <section className="features-section">
          <h2>Fonctionnalités Principales</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Gestion des emplois du temps</h3>
              <p>Organisez vos tâches et horaires facilement.</p>
            </div>
            <div className="feature-card">
              <h3>Suivi de progression</h3>
              <p>Suivez l'avancement de vos projets en temps réel.</p>
            </div>
            <div className="feature-card">
              <h3>Notifications et rappels</h3>
              <p>Recevez des alertes pour ne rien oublier.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="admin-footer">
        <div className="footer-content">
          <ul className="footer-links">
            <li><Link className="footer-link" to="/about">À propos</Link></li>
            <li><Link className="footer-link" to="/contact">Contact</Link></li>
            <li><Link className="footer-link" to="/privacy">Politique de confidentialité</Link></li>
          </ul>
          <div className="social-icons">
            <a href="https://facebook.com/eemploi" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com/eemploi" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="https://linkedin.com/company/eemploi" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
            <a href="mailto:contact@e-emploi.com"><i className="fas fa-envelope"></i></a>
          </div>
        </div>
        <div className="footer-disclaimer">
          <p>&copy; 2024 E-Emploi. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
