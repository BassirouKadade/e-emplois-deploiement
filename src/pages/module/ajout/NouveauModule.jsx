import React, { useEffect, useState } from 'react'; // Importation des hooks de React
import Button from '@mui/material/Button'; // Importation du composant Button de Material-UI
import { REGEX_REST } from '../../../request/regex';
import { useMutation, useQueryClient } from 'react-query'; // Importation des hooks de react-query pour gérer les mutations et le cache
import { ajouterModule } from '../../../request/moduleRequest/moduleRequest';
import { SmileOutlined } from '@ant-design/icons'; // Importation d'une icône de Ant Design
import { notification } from 'antd'; // Importation du module de notification de Ant Design
import Progress from '../../../components/Progess'; // Importation du composant Progress pour l'affichage du chargement
import { Helmet } from 'react-helmet';
export default function NouveauModule() {
  // État pour suivre les erreurs de validation
  const [errors, setErrors] = useState({
    codeModule: false,
    masseHoraire: false,
    MHP: false,
    MHD: false,
    description: false,
  });

  // Utilisation des notifications de Ant Design
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      placement: "topLeft",
      message: 'Nouveau Module',
      description: 'Module créé avec succès',
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

  // État pour les erreurs du serveur
  const [errorServer, setErrorServer] = useState({});
  
  // Instance de QueryClient de React Query pour la gestion du cache
  const queryClient = useQueryClient();

  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    codeModule: '',
    masseHoraire: '',
    MHP: '',
    MHD: '',
    description: '',
  });

  // Mutation pour gérer l'ajout du module
  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await ajouterModule(data); // Tente d'ajouter le module
      clearFormData(); // Efface les données du formulaire en cas de succès
      openNotification(); // Ouvre une notification pour indiquer le succès
    } catch (error) {
      setErrorServer(error.response?.data || {}); // Définit les erreurs du serveur
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['liste-module', 1]); // Invalide la requête en cache après une réussite
    },
  });

  // Fonction pour vérifier les erreurs de validation avec une regex
  function regexError(data) {
    let hasError = false;
  
    const newErrors = {
      codeModule: !REGEX_REST.test(data.codeModule),
      masseHoraire: !REGEX_REST.test(data.masseHoraire),
      MHP: !REGEX_REST.test(data.MHP),
      MHD: data.MHD !== 0 && !REGEX_REST.test(data.MHD), // Autoriser MHD à être zéro
      description: !REGEX_REST.test(data.description),
    };
  
    setErrors(newErrors);
    hasError = Object.values(newErrors).some(error => error); // Vérifie s'il y a des erreurs
  
    return !hasError;
  }
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regexError(formData)) {
      return;
    }
    mutate(formData); // Appelle la mutation avec les données du formulaire
  };

  // Efface les données du formulaire
  const clearFormData = () => {
    setFormData({
      codeModule: '',
      masseHoraire: '',
      MHP: '',
      MHD: '',
      description: '',
    });
    setErrors({
      codeModule: false,
      masseHoraire: false,
      MHP: false,
      MHD: false,
      description: false,
    });
    setErrorServer({});
  };

  // Gère les changements dans les champs de saisie
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Met à jour le champ MHD (Masse Horaire à Distance) en fonction de la Masse Horaire Totale et de la Masse Horaire Présentielle
  useEffect(() => {
    setFormData(prev => ({ ...prev, MHD: parseInt(prev.masseHoraire) - parseInt(prev.MHP) }))
  }, [formData.masseHoraire, formData.MHP]);
  
  return (
    <section className="parentModule">
         <Helmet>
      <title>Ajouter-Module | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="module">
        <h3>Module</h3>
      </div>
      <form className="formModule" onSubmit={handleSubmit}>
        <div className="moduleChild">
          <div className="info">
            <label className="label" htmlFor="codeModule">
              <span>Code du Module <span className="champsO">*</span></span>
              {errorServer.existeCode && <span className='existData'>{errorServer.existeCode}</span>}
            </label>
            <input
              type="text"
              id="codeModule"
              name="codeModule"
              placeholder="Code ..."
              onChange={handleInputChange}
              value={formData.codeModule}
              className={`inputClass ${errors.codeModule ? 'is-invalid-error' : !errors.codeModule && formData.codeModule ? 'is-valid-confirm' : ''}`}
            />
          </div>
          <div className="info">
            <label className="label" htmlFor="masseHoraire">
              <span>Masse Horaire Totale <span className="champsO">*</span></span>
            </label>
            <input
              type="number"
              id="masseHoraire"
              name="masseHoraire"
              placeholder="MH ..."
              onChange={handleInputChange}
              value={formData.masseHoraire}
              className={`inputClass ${errors.masseHoraire ? 'is-invalid-error' : !errors.masseHoraire && formData.masseHoraire ? 'is-valid-confirm' : ''}`}
            />
          </div>
        </div>
        <div className="moduleChild">
          <div className="info">
            <label className="label" htmlFor="MHP">
              <span>Masse Horaire Présentielle <span className="champsO">*</span></span>
            </label>
            <input
              type="number"
              id="MHP"
              name="MHP"
              placeholder="MHP ..."
              onChange={handleInputChange}
              value={formData.MHP}
              className={`inputClass ${errors.MHP ? 'is-invalid-error' : !errors.MHP && formData.MHP ? 'is-valid-confirm' : ''}`}
            />
          </div>
          <div className="info">
            <label className="label" htmlFor="MHD">
              <span>Masse Horaire à Distance <span className="champsO">*</span></span>
            </label>
            <input
              type="number"
              id="MHD"
              readOnly
              name="MHD"
              placeholder="MHD ..."
              onChange={handleInputChange}
              value={formData.MHD}
              className={`inputClass ${errors.MHD ? 'is-invalid-error' : !errors.MHD && formData.MHD ? 'is-valid-confirm' : ''}`}
            />
          </div>
        </div>
        <div className="moduleChild">
          <div style={{width:"100%"}} className="info">
            <label className="label" htmlFor="description">
              <span>Description <span className="champsO">*</span></span>
              {errorServer.existeDescription && <span className='existData'>{errorServer.existeDescription}</span>}
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description du module"
              onChange={handleInputChange}
              value={formData.description}
              style={{ resize: "none" }}
              className={`inputClass ${errors.description || errorServer.existeDescription ? 'is-invalid-error' : !errors.description && formData.description ? 'is-valid-confirm' : ''}`}
            ></textarea>
          </div>
        </div>
        <div className="moduleChild">
          <Button type="submit" className="buttonMbut articleButton" disabled={isLoading}>
            {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} /> : 'Ajouter'}
          </Button>
        </div>
      </form>
      {contextHolder}
    </section>
  );
}
