import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { REGEX_REST } from '../../../request/regex';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import mettreAJourEtablissement from '../../../request/etablissementRequest/etablissementRequest';
import Progress from '../../../components/Progess';
import { Helmet } from 'react-helmet';
import { listeTousUsersNonPagine } from '../../../request/userRequest/userRequest';

export default function EtablissementMod({ openNotification, handleClose, currentPages: { totalPages, setIsSearching, currentPageRechercher, currentPage }, etablissement }) {
  
  const [errors, setErrors] = useState({
    nom: false,
    adresse: false,
    id_user: false
  });

  const dataInit = totalPages.datainit;
  const dataRechercher = totalPages.rechercher;

  const [errorServer, setErrorServer] = useState({});
  
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(etablissement);

  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await mettreAJourEtablissement(data);
      clearFormData();
      handleClose();
      openNotification();
    } catch (error) {
      setErrorServer(error.response.data);
    }
  }, {
    onSuccess: () => {
      if (dataInit) {
        queryClient.invalidateQueries(['liste-etablissements', currentPage]);
      }
      if (dataRechercher) {
        queryClient.invalidateQueries(['search-etablissements', currentPageRechercher]);
        setIsSearching(true);
      }
    },
  });

  function regexError(data) {
    const newErrors = {
      nom: !REGEX_REST.test(data.nom),
      adresse: !REGEX_REST.test(data.adresse),
      id_user: !data.id_user
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regexError(formData)) {
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
    setErrors({
      nom: false,
      adresse: false,
      id_user: false
    });
    setErrorServer({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { data, isLoading: isLoadingUsers } = useQuery(['liste-users-all'], async () => {
    try {
      const response = await listeTousUsersNonPagine();
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  return (
    <section style={{width:"600px",padding:"0 30px"}}  className="parentModule">
         <Helmet>
      <title>Modification-Etablissement | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
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
              {errorServer.existeNom && <span className='existData'>{errorServer.existeNom}</span>}
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              placeholder="Nom ..."
              onChange={handleInputChange}
              value={formData.nom}
              className={`inputClass ${errors.nom ? 'is-invalid-error' : !errors.nom && formData.nom ? 'is-valid-confirm' : ''}`}
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
              className={`inputClass ${errors.id_user ? 'is-invalid-error' : !errors.id_user && formData.id_user ? 'is-valid-confirm' : ''}`}
            >
              <option value="">Sélectionner un directeur</option>
              {isLoadingUsers && !data ? "Chargement..." :
                data.map((user, index) => (
                  <option key={index} value={user.id}>{user.nom} {user.prenom}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="moduleChild">
          <div className="info infoDescription" style={{ width: "100%" }}>
            <label className="label" htmlFor="adresse">
              <span>Adresse <span className="champsO">*</span></span>
            </label>
            <textarea
              id="adresse"
              name="adresse"
              placeholder="Adresse ..."
              onChange={handleInputChange}
              value={formData.adresse}
              className={`inputClass ${errors.adresse ? 'is-invalid-error' : !errors.adresse && formData.adresse ? 'is-valid-confirm' : ''}`}
            />
          </div>
        </div>
        <div className="moduleChild">
          <Button type="submit" className="buttonMbut articleButton" disabled={isLoading}>
            {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} /> : 'mettre à jour'}
          </Button>
        </div>
      </form>
    </section>
  );
}
