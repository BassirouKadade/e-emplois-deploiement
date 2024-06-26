import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { REGEX_REST } from '../../../request/regex';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ajouterEtablissement } from '../../../request/etablissementRequest/etablissementRequest';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { Helmet } from 'react-helmet';
import Progress from '../../../components/Progess';
import { listeTousUsersNonPagineAndNotEtablissement } from '../../../request/userRequest/userRequest';
export default function AddEtablissement() {
  const [formErrors, setFormErrors] = useState({
    nom: false,
    adresse: false,
    id_user: false
  });

  const [notificationAPI, notificationHolder] = notification.useNotification();

  const openNotification = () => {
    notificationAPI.open({
      placement: "topLeft",
      message: 'Nouvel Établissement',
      description: 'Établissement créé avec succès',
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
    adresse: '',
    id_user: ''
  });

  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await ajouterEtablissement(data); // Ajout de l'établissement
      clearFormData();
      openNotification();
    } catch (error) {
      setServerError(error.response?.data || {});
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['liste-etablissements', 1]); // Invalidation du cache
    },
  });

  function validateFormData(data) {
    let hasError = false;

    const newErrors = {
      nom: !REGEX_REST.test(data.nom),
      adresse: !REGEX_REST.test(data.adresse),
      id_user: !data.id_user
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
      adresse: '',
      id_user: ''
    });
    setFormErrors({
      nom: false,
      adresse: false,
      id_user: false
    });
    setServerError({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { data, isLoading: isLoadingListeFiliere } = useQuery(['liste-users-all'], async () => {
    try {
      const response = await listeTousUsersNonPagineAndNotEtablissement();
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  return (
    <section className="parentModule">
         <Helmet>
      <title>Ajouter-Etablissement | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="module">
        <h3>Établissement</h3>
      </div>
      <form className="formModule" onSubmit={handleSubmit}>
        <div className="moduleChild">
          <div className="info">
            <label className="label" htmlFor="nom">
              <span>Nom <span className="champsO">*</span></span>
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
            <label className="label" htmlFor="id_user">
              <span>Directeur <span className="champsO">*</span></span>
            </label>
            <select
              id="id_user"
              name="id_user"
              onChange={handleInputChange}
              value={formData.id_user}
              className={`inputClass ${formErrors.id_user ? 'is-invalid-error' : !formErrors.id_user && formData.id_user ? 'is-valid-confirm' : ''}`}
            >
              <option value="">Sélectionner un directeur</option>
              {isLoadingListeFiliere && !data ? "Chargement..." :
                data.map((user, index) => (
                  <option key={index} value={user.id}>{user.nom} {user.prenom}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="moduleChild">
          <div className="info infoDescription" style={{ width: "100%" }}>
          <label className="label" htmlFor="id_user">
              <span>Adresse <span className="champsO">*</span></span>
            </label>
            <textarea
              id="adresse"
              name="adresse"
              placeholder="Adresse ..."
              onChange={handleInputChange}
              value={formData.adresse}
              className={`inputClass ${formErrors.adresse ? 'is-invalid-error' : !formErrors.adresse && formData.adresse ? 'is-valid-confirm' : ''}`}
            />
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
