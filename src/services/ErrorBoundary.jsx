import React from 'react';
import './boundaryCss.css'
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    // Gestion des erreurs supplémentaire si nécessaire
  }

  render() {
    if (this.state.hasError) {
      // Affichage d'une page d'erreur stylisée
      return (
        <div className="error-page">
          <div className="error-details">
            <div className="icon">&#x26A0;</div> {/* Icône d'avertissement */}
            <h2>Quelque chose s'est mal passé.</h2>
            <p>Nous nous excusons pour le désagrément. Veuillez réessayer plus tard.</p>
            <div className="button-container">
              <a href="/" className="button">Retour à la page d'accueil</a>
            </div>
          </div>
        </div>
      );
    }

    // Rendu normal des enfants si aucune erreur
    return this.props.children;
  }
}

export default ErrorBoundary;
