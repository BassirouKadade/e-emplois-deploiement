import React, { useState } from 'react';
import {  Link } from 'react-router-dom';
import { BsBrowserEdge } from "react-icons/bs";
import '../../styles/auth/auth.css';
import Progress from '../../components/Progess';
import { useMutation } from 'react-query';
import { Helmet } from 'react-helmet';
import {getEmail, setEmail } from '../../services/authUntils';
import { loginUser } from '../../request/authRequest/authRequest';
import Logo from '../../assets/E-Emplois22_no_bg.svg'
import { useNavigate } from 'react-router-dom';
import { setSecureLocalStorageItem } from '../../services/authUntils';
const regexEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

export default function Login() {
  const navigate=useNavigate()
  const [data, setData] = useState({
    email:getEmail()?getEmail():"",
    password: "",
    remember: false
  });

  const [errorMessages, setErrorMessages] = useState({
    emailError: "",
    passwordError: "",
    errorServer: {}
  });

  const mutation = useMutation(loginUser, {
    onSuccess: (response) => {
      window.location.href='/one-time-password';
      setEmail(data.email)
      setSecureLocalStorageItem('user_auth',response)
    },
    onError: (error) => {
      console.error('Identifiants incorrects. Veuillez réessayer.', error);
      setErrorMessages(prev => ({ ...prev, errorServer: error?.response?.data || {} }));
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      mutation.mutate(data);
    }
  }

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === "remember" ? checked : value;
    setData({ ...data, [name]: newValue });
  };

  const validateEmail = () => {
    if (!data.email.trim()) {
      setErrorMessages({ ...errorMessages, emailError: "Veuillez fournir une adresse e-mail." });
      return false;
    } else if (!regexEmail.test(data.email)) {
      setErrorMessages({ ...errorMessages, emailError: "Adresse e-mail invalide." });
      return false;
    }
    setErrorMessages({ ...errorMessages, emailError: "" });
    return true;
  }

  const validatePassword = () => {
    if (!data.password.trim()) {
      setErrorMessages({ ...errorMessages, passwordError: "Veuillez fournir un mot de passe." });
      return false;
    }
    setErrorMessages({ ...errorMessages, passwordError: "" });
    return true;
  }

  return (
    <section className='section2'>
         <Helmet>
      <title>Authentification | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <article className='sous-section2'>
      <div className="descriptionsection">
    <h3 style={{ 
        fontSize: '28px', 
        color: 'rgb(0 ,167 ,111)', 
        textAlign:"center",
        marginTop:"30px"
    }}> Bienvenue !</h3>
    <p style={{ 
        fontSize: '14px', 
        textAlign:"center",
        lineHeight: '1.6', 
        color: '#666' 
    }}>Gérez votre profil et vos emplois du temps en toute simplicité.</p>
</div>

        <form onSubmit={handleSubmit} className='enfant2'>
          <div className="groupe g1">
            <label className='label' htmlFor="email">
              <span className="text">Email</span>
              {errorMessages.emailError && <span className="errorText">{errorMessages.emailError}</span>}
            </label>
            <input
              className={`input ${errorMessages?.emailError || errorMessages?.errorServer?.errorEmail ? 'errorMessage' : ''}`}
              type="text"
              id="email"
              placeholder='email@exemple.com'
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="groupe g2">
            <label className='label' htmlFor="password">
              <span className='text'>Mot de passe</span>
              <Link to="/mot-de-passe-oublie" className='lien'>Mot de passe oublié ?</Link>
            </label>
            <input
              className={`input ${errorMessages.passwordError ? 'errorMessage' : ''}`}
              type="password"
              id="password"
              placeholder='*********'
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            {errorMessages.passwordError && <span className="errorText">{errorMessages.passwordError}</span>}
          </div>
          <div className="groupe g3">
            <button className='button' disabled={mutation.isLoading}>
              {mutation.isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} /> : "Se connecter"}
            </button>
            {errorMessages?.errorServer?.errorPassword && <span style={{ margin: "5px 1px" }} className="errorText">{errorMessages.errorServer.errorPassword}</span>}
            {errorMessages?.errorServer?.errorEmail && <span style={{ margin: "5px 1px" }} className="errorText">{errorMessages.errorServer.errorEmail}</span>}
          </div>
        </form>
      </article>
    </section>
  );
}