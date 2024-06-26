import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { REGEX_REST } from '../../../request/regex';
import { useMutation, useQueryClient } from 'react-query';
import { ajouterSalle } from '../../../request/salleRequest/salleRequest';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import '../../../styles/salle/nouvelleSalle.css'
import { Helmet } from 'react-helmet';
import Progress from '../../../components/Progess';
export default function NouvelleSalle() {
  const [formErrors, setFormErrors] = useState({
    nom: false,
    capacite: false,
    MH: false,
    MREST: false,
  });

  const [notificationAPI, notificationHolder] = notification.useNotification();

  const openNotification = () => {
    notificationAPI.open({
      placement: "topLeft",
      message: 'Nouvelle Salle',
      description: 'Salle créée avec succès',
      icon: (
        <SmileOutlined
          style={{
            color: 'rgb(0, 167, 111)',
          }}
        />
      ),
      duration: 2,
    });
  };

  const [serverError, setServerError] = useState({});

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nom: '',
    capacite: 25,
    MH: 60,
    MREST: '',
    emplacement: '',
  });

    useEffect(()=>{
         setFormData(prev=>({...prev,MREST:prev.MH}))
    },[formData])
    
  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await ajouterSalle(data);
      clearFormData();
      openNotification();
    } catch (error) {
      setServerError(error.response?.data || {});
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['liste-salle', 1]);
    },
  });

  function validateFormData(data) {
    let hasError = false;

    const newErrors = {
      nom: !REGEX_REST.test(data.nom),
      capacite: !REGEX_REST.test(data.capacite),
      MH: !REGEX_REST.test(data.MH),
      MREST: !REGEX_REST.test(data.MREST),
    };

    setFormErrors(newErrors);
    hasError = Object.values(newErrors).some(error => error);

    return !hasError;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData(formData)) {
      return;
    }
    mutate(formData);
  };

  const clearFormData = () => {
    setFormData({
      nom: '',
      capacite: '',
      MH: 60,
      MREST:'',
      emplacement: '',
    });
    setFormErrors({
      nom: false,
      capacite: false,
      MH: false,
      MREST: false,
    });
    setServerError({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="parentModule">
        <Helmet>
      <title>Ajouter-Salle | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="module">
        <h3>Salle</h3>
      </div>
      <form className="formModule" onSubmit={handleSubmit}>
        <div className="moduleChild">
          <div className="info">
            <label className="label" htmlFor="nom">
              <span>Nom de salle <span className="champsO">*</span></span>
              {serverError.existeNom && <span className='existData'>{serverError.existeNom}</span>}
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              placeholder="Nom ..."
              onChange={handleInputChange}
              value={formData.nom}
              className={`inputClass ${formErrors.nom ? 'is-invalid-error' : !formErrors.nom && formData.nom ? 'is-valid-confirm' : ''}`}
            />
          </div>
          <div className="info">
            <label className="label" htmlFor="capacite">
              <span>Capacité <span className="champsO">*</span></span>
            </label>
            <input
              type="number"
              id="capacite"
              name="capacite"
              placeholder="Capacité ..."
              onChange={handleInputChange}
              value={formData.capacite}
              className={`inputClass ${formErrors.capacite ? 'is-invalid-error' : !formErrors.capacite && formData.capacite ? 'is-valid-confirm' : ''}`}
            />
          </div>
        </div>
        <div className="moduleChild">
          <div className="info">
            <label className="label" htmlFor="MH">
              <span>Masse Horaire <span className="champsO">*</span></span>
            </label>
            <input
              type="number"
              id="MH"
              name="MH"
              placeholder="MH ..."
              onChange={handleInputChange}
              value={formData.MH}
              className={`inputClass ${formErrors.MH ? 'is-invalid-error' : !formErrors.MH && formData.MH ? 'is-valid-confirm' : ''}`}
            />
          </div>
          <div className="info">
            <label className="label" htmlFor="MREST">
              <span>Masse Horaire Restante <span className="champsO">*</span></span>
            </label>
            <input
              type="number"
              id="MREST"
              name="MREST"
              placeholder="MREST ..."
              value={formData.MREST}
              readOnly
              className={`inputClass ${formErrors.MREST ? 'is-invalid-error' : !formErrors.MREST && formData.MREST ? 'is-valid-confirm' : ''}`}
            />
          </div>
        </div>
        <div className="moduleChild">
          <div className="info infoDescription">
            <label className="label" htmlFor="emplacement">
              <span>Emplacement</span>
              {serverError.existeEmplacement && <span className='existData'>{serverError.existeEmplacement}</span>}
            </label>
            <textarea
              id="emplacement"
              name="emplacement"
              placeholder="Emplacement de la salle"
              onChange={handleInputChange}
              value={formData.emplacement}
              style={{ resize: "none" }}
              className={`inputClass ${serverError.existEmplacement ? 'is-invalid-error' : ''}`}
            ></textarea>
          </div>
        </div>
        <div className="moduleChild">
          <Button type="submit" className="buttonMbut articleButton" disabled={isLoading}>
            {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} /> : 'Ajouter'}
          </Button>
        </div>
      </form>
      {notificationHolder}
    </section>
  );
}
