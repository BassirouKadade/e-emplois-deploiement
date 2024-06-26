import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineDownCircle } from 'react-icons/ai';
import '../../styles/auth/auth.css';
import { Helmet } from 'react-helmet';
export default function MessageSuccss() {
    return (
        <section className='section container-fluid'>
               <Helmet>
      <title>Message-Success | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
            <article className='sous-section-message'>
                <span className='reset-password-icon'>
                    <AiOutlineDownCircle className='inconsAuth' style={{ fontSize: '70px' }} />
                </span>
                <div>
                    <p>Un email de réinitialisation de mot de passe a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception.</p>
                </div>
                <div style={{paddingBottom:"10px"}}>
                    <Link to={"/"} className='reset-password-link'>Appuyer pour se connecter</Link>
                </div>
            </article>
        </section>
    );
}
