import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth/auth.css';
import Logo from '../../assets/E-Emplois22_no_bg.svg'
import Progress from '../../components/Progess';
import { BsBrowserEdge } from "react-icons/bs";
import { useMutation } from 'react-query';
import { getEmail } from '../../services/authUntils';
import { forgotPassword } from '../../request/authRequest/authRequest';
import { Helmet } from 'react-helmet';
const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: getEmail() || "" });
  const [errorMessages, setErrorMessages] = useState({ emailError: '', errorServer: { errorEmail: '', database: '' } });

  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      const response = await forgotPassword(data);
      return response.data;
    } catch (error) {
      setErrorMessages(prev => ({ ...prev, errorServer: error }));
      throw error;
    }
  }, {
    onSuccess: () => {
      navigate('/message-success'); // Correction du nom de la route
    }
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validateEmail = () => {
    if (!data.email.trim()) {
      setErrorMessages(prev => ({ ...prev, emailError: "Veuillez fournir une adresse e-mail." }));
      return false;
    } else if (!regexEmail.test(data.email)) {
      setErrorMessages(prev => ({ ...prev, emailError: "Adresse e-mail invalide." }));
      return false;
    }
    setErrorMessages(prev => ({ ...prev, emailError: "" }));
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail()) {
      return;
    }
    mutate(data);
  };

  return (
    <section className='section container-fluid'>
         <Helmet>
      <title>Mot de passe oublier | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <article  className='sous-section-oublier'>
      <span  style={{margin:0}} className='inconsAuth'>
         <img width={'110px'} height={'110px'} src={Logo} alt="" />
         </span>
        <form style={{width:450}}  onSubmit={handleSubmit} className='enfant2'>
          <div className="groupe g1">
            <label className='label' htmlFor="email">
              <span className="text">Email</span>
              {errorMessages?.errorServer?.errorEmail && <span style={{ color: "red" }}>{errorMessages?.errorServer?.errorEmail}</span>}
              {errorMessages?.emailError && <span style={{ color: "red" }}>{errorMessages?.emailError}</span>}
            </label>
            <input
              className={`input ${errorMessages?.emailError || errorMessages?.errorServer?.errorEmail ? "error-border" : ""}`}
              type="text"
              id="email"
              placeholder='email@exemple.com'
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="groupe g3">
            <button className='liens button liens1' disabled={isLoading}>
              {isLoading ? (
                <span><Progress w={"25px"} h={"25px"} color={'white'} /></span>
              ) : "Envoyer l'email pour restaurer le mot de passe"}
            </button>
            {errorMessages?.errorServer?.database && (
              <span style={{ color: "red", fontSize: "14px", marginTop: "6px" }}>{errorMessages?.errorServer?.database}</span>
            )}
          </div>
          <div style={{ marginTop: "-4px" }} className='groupe'>
            <span className='labels'>
              Rappelez-vous de mot de passe ?
              <Link className='lien' to='/'> Se connecter</Link>
            </span>
          </div>
        </form>
      </article>
    </section>
  );
}
