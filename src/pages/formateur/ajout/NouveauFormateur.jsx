import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { REGEX_EMAIL ,REGEX_REST} from '../../../request/regex';
import '../../../styles/formateur/nouveauFormateur.css'
import { useMutation, useQueryClient } from 'react-query';
import { ajouterFormateur } from '../../../request/formateurRequest/formateurRequest';
import Progress from '../../../components/Progess';
import { SmileOutlined } from '@ant-design/icons';
import {  notification } from 'antd';
import { Helmet } from 'react-helmet';
export default function NouveauFormateur() {
  const [errors, setErrors] = useState({
    matricule: false,
    nom: false,
    prenom: false,
    metier: false,
    email: false,
  });

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      placement: "topRight",
      message: 'Nouveau Formateur',
      description: 'Formateur créé avec succès',
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
    matricule: '',
    nom: '',
    prenom: '',
    metier: '',
    email: '',
  });

  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await ajouterFormateur(data);
      clearFormData();
      openNotification()
    } catch (error) {
      setErrorServer(error.response.data);
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['liste-formateur',1]);
    },
  });

  function regexError(data) {
    let hasError = false;

    if (!REGEX_REST.test(data.matricule)) {
      setErrors(prev => ({ ...prev, matricule: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, matricule: false }));
    }

    if (!REGEX_REST.test(data.metier)) {
      setErrors(prev => ({ ...prev, metier: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, metier: false }));
    }

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
      matricule: '',
      nom: '',
      prenom: '',
      metier: '',
      email: '',
    });
    setErrorServer({})
  };

  return (
    
    <section 
    style={{boxShadow:"none",width:"100%",padding:"0 10px"}}
    className="parentFormateur">
        {contextHolder}
        <Helmet>
      <title>Ajouter-Formateur | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="formateur">
        <h3 id="Text">Formateur</h3>
      </div>
      <form onSubmit={handleSubmit} className="formateur">
        <article className="formaterChild">
          <div className="info">
            <label className="label" htmlFor="matricule">
              <span>Matricule <span className="champsO">*</span></span>
              {errorServer.existMat && <span className='existData'>{errorServer.existMat}</span>}
            </label>
            <input
              type="text"
              id="matricule"
              name="matricule"
              placeholder="Matricule ..."
              className={`inputClass ${errors.matricule || errorServer.existMat ? 'is-invalid-error' : errors.matricule === false ? 'is-valid-confirm' : ''}`}
              value={formData.matricule}
              onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
            />
          </div>

          <div className="info">
            <label className="label" htmlFor="metier">
              <span>Métier <span className="champsO">*</span></span>
            </label>
            <input
              type="text"
              id="metier"
              name="metier"
              placeholder="Métier ..."
              className={`inputClass ${errors.metier ? 'is-invalid-error' : errors.metier === false ? 'is-valid-confirm' : ''}`}
              value={formData.metier}
              onChange={(e) => setFormData({ ...formData, metier: e.target.value })}
            />
          </div>
        </article>

        <article className="formaterChild">
          <div style={{width:"100%"}} className="info infoEmail">
            <label className="label" htmlFor="email">
              <span>Email <span className="champsO">*</span></span>
              {errorServer.existEmail && <span className='existData'>{errorServer.existEmail}</span>}
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
        </article>

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
              className={`inputClass ${errors.nom ? 'is-invalid-error' : errors.nom === false ? 'is-valid-confirm' : ''}`}
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

        <div className="formaterChild buttonF">
          <Button type="submit" className="buttonMbut articleButton" disabled={isLoading}>
            {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} />  : 'Ajouter'}
          </Button>
        </div>
      </form>
    </section>
  );
}

