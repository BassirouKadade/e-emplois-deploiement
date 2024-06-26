import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BsBrowserEdge } from "react-icons/bs";
import { useMutation } from 'react-query';
import '../../styles/auth/auth.css';
import { Helmet } from 'react-helmet';
import Progress from '../../components/Progess';
import { resetUserPassword } from '../../request/authRequest/authRequest';
export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({ token: token, nouveauMotDePasse: '', confirmationMotDePasse: '' });
    const [errorMessages, setErrorMessages] = useState({ passwordError: '', confirmationError: '', errorServer: { database: '' } });

    const { mutate, isLoading: loading } = useMutation(async (data) => {
        try {
            const response = await resetUserPassword(data); // Correction de la fonction appelée
            return response.data;
        } catch (error) {
            setErrorMessages(prev => ({ ...prev, errorServer: error.response.data })); // Modification de la façon de définir les erreurs du serveur
            throw error;
        }
    }, {
        onSuccess: () => {
            navigate('/');
        }
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const validatePassword = () => {
        if (!data.nouveauMotDePasse.trim()) {
            setErrorMessages(prev => ({ ...prev, passwordError: "Veuillez fournir un nouveau mot de passe." }));
            return false;
        }
        setErrorMessages(prev => ({ ...prev, passwordError: "" }));
        return true;
    };

    const validateConfirmation = () => {
        if (!data.confirmationMotDePasse.trim()) {
            setErrorMessages(prev => ({ ...prev, confirmationError: "Veuillez confirmer le nouveau mot de passe." }));
            return false;
        } else if (data.confirmationMotDePasse !== data.nouveauMotDePasse) {
            setErrorMessages(prev => ({ ...prev, confirmationError: "Les mots de passe ne correspondent pas." }));
            return false;
        }
        setErrorMessages(prev => ({ ...prev, confirmationError: "" }));
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword() || !validateConfirmation()) {
            return;
        }
        mutate(data);
    };

    return (
        <section className='section container-fluid'>
              <Helmet>
      <title>Reinitialisation de mot de paase | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
            <article className='sous-section-oublier'>
                <span className='inconsAuth'>
                    <BsBrowserEdge></BsBrowserEdge>
                </span>
                <form style={{width:'450px'}} onSubmit={handleSubmit} className='enfant2'>
                    <div className="groupe g1">
                        <label className='label' htmlFor="nouveauMotDePasse">
                            <span className="text">Nouveau Mot de passe</span>
                            {errorMessages.passwordError && <span style={{ color: "red" }}>{errorMessages.passwordError}</span>}
                        </label>
                        <input
                            className={`input`}
                            type="password"
                            id="nouveauMotDePasse"
                            style={{ border: errorMessages.passwordError ? "1px solid red" : "" }}
                            placeholder='Nouveau mot de passe'
                            name="nouveauMotDePasse"
                            value={data.nouveauMotDePasse}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="groupe g2">
                        <label className='label' htmlFor="confirmationMotDePasse">
                            <span className='text'>Confirmation</span>
                            {errorMessages.confirmationError && <span style={{ color: "red", fontSize: "14px" }}>{errorMessages.confirmationError}</span>}
                        </label>
                        <input
                            className={`input`}
                            type="password"
                            id="confirmationMotDePasse"
                            style={{ border: errorMessages.confirmationError ? "1px solid red" : "" }}
                            placeholder='Confirmez le nouveau mot de passe'
                            name="confirmationMotDePasse"
                            value={data.confirmationMotDePasse}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="groupe g3">
                        <button className='liens button liens1' style={{ backgroundColor: loading ? "rgba(29, 120, 120, 0.595)" : "" }} disabled={loading}>
                            {loading ? (
                                <span> <Progress w={"25px"} h={"25px"} color={'white'} /></span>
                            ) : "Changer le mot de passe"}
                        </button>
                        {errorMessages.errorServer.message && (
                            <span style={{ color: "red", fontSize: "14px", marginTop: "6px" }}>{errorMessages.errorServer.message}</span>
                        )}
                    </div>
                </form>
            </article>
        </section>
    );
}
