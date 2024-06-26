import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { REGEX_EMAIL, REGEX_REST } from '../../../request/regex';
import '../../../styles/formateur/nouveauFormateur.css'; // Conserver le chemin de CSS actuel
import { useMutation, useQueryClient } from 'react-query';
import { ajouterUser } from '../../../request/userRequest/userRequest'; // Mettre à jour la requête
import Progress from '../../../components/Progess';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { REGEX_PASSWORD } from '../../../request/regex';
import { Helmet } from 'react-helmet';
export default function NouveauDirecteur() {
  const [errors, setErrors] = useState({
    nom: false,
    prenom: false,
    email: false,
    password: false,
  });

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      placement: "topLeft",
      message: 'Nouveau Directeur',
      description: 'Directeur créé avec succès',
      icon: (
        <SmileOutlined
          style={{
            color: 'rgb(0, 167, 111)',
          }}
        />
      ),
      duration: 2 // Durée en secondes avant que la notification disparaisse
    });
  };

  const [errorServer, setErrorServer] = useState({});
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: ''
  });

  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await ajouterUser(data);
      clearFormData();
      openNotification();
    } catch (error) {
      setErrorServer(error.response.data);
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['liste-user', 1]);
    },
  });

  function regexError(data) {
    let hasError = false;

    if (!REGEX_EMAIL.test(data.email)) {
      setErrors(prev => ({ ...prev, email: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, email: false }));
    }

    if (!REGEX_REST.test(data.nom)) {
      setErrors(prev => ({ ...prev, nom: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, nom: false }));
    }

    if (!REGEX_REST.test(data.prenom)) {
      setErrors(prev => ({ ...prev, prenom: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, prenom: false }));
    }

    if (!REGEX_PASSWORD.test(data.password)) {
      setErrors(prev => ({ ...prev, password: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, password: false }));
    }

    return !hasError;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (!regexError(formData)) {
      return;
    }
    mutate(formData);
  };

  const clearFormData = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      password: ''
    });
    setErrorServer({});
  };

  return (
    <section style={{boxShadow:"none",width:"410px",padding:"10px"}} className="parentFormateur">
      {contextHolder}
      <Helmet>
      <title>Liste-Directeur | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="formateur">
        <h3 id="Text">Directeur</h3>
      </div>
      <form onSubmit={handleSubmit} className="formateur">
        <article className="formaterChild">
          <div className="info">
            <label className="label" htmlFor="nom">
              <span>Nom <span className="champsO">*</span></span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              placeholder="Nom ..."
              className={`inputClass ${errors.nom || errorServer.existNom ? 'is-invalid-error' : errors.nom === false ? 'is-valid-confirm' : ''}`}
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
          </div>

          <div className="info">
            <label className="label" htmlFor="prenom">
              <span>Prénom <span className="champsO">*</span></span>
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              placeholder="Prénom ..."
              className={`inputClass ${errors.prenom ? 'is-invalid-error' : errors.prenom === false ? 'is-valid-confirm' : ''}`}
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            />
          </div>
        </article>

        <article className="formaterChild">
          <div className="info">
            <label className="label" htmlFor="email">
              <span>Email <span className="champsO">*</span> 
             </span>
             {errorServer?.existEmail && <span className='existData'>{errorServer?.existEmail}</span>}
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email ..."
              className={`inputClass ${errors.email || errorServer.existEmail ? 'is-invalid-error' : errors.email === false ? 'is-valid-confirm' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="info">
            <label className="label" htmlFor="password">
              <span>Password <span className="champsO">*</span></span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password ..."
              className={`inputClass ${errors.password ? 'is-invalid-error' : errors.password === false ? 'is-valid-confirm' : ''}`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </article>

        <div className="formaterChild buttonF">
          <Button type="submit" className="buttonMbut articleButton" disabled={isLoading}>
            {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} /> : 'Ajouter'}
          </Button>
        </div>
      </form>
    </section>
  );
}
