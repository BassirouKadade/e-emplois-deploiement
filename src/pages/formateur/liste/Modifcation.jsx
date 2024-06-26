import { useState } from 'react';
import Button from '@mui/material/Button';
import '../../../styles/formateur/modification.css'
import { Helmet } from 'react-helmet';
import { REGEX_EMAIL,REGEX_REST, } from '../../../request/regex';
import { useMutation, useQueryClient } from 'react-query';
import Progress from '../../../components/Progess';
import { updateformateur } from '../../../request/formateurRequest/formateurRequest';
export default function Modification({ openNotification, handleClose, currentPages: { totalPages, setIsSearching, currentPageRechercher, currentPage }, formateur }) {
  // State pour gérer les erreurs de validation
  
  
  const [errors, setErrors] = useState({
    matricule: false,
    nom: false,
    prenom: false,
    metier: false,
    email: false,
  });

  // Récupération des données initiales et de recherche
  const dataInit = totalPages.datainit;
  const dataRechercher = totalPages.rechercher;

  // State pour gérer les erreurs serveur
  const [errorServer, setErrorServer] = useState({});
  const queryClient = useQueryClient();

  // State pour stocker les données du formulaire
  const [formData, setFormData] = useState(formateur);

  // Mutation pour mettre à jour le formateur
  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await updateformateur(data);
      clearFormData();
      handleClose();
      openNotification();
    } catch (error) {
      setErrorServer(error.response.data);
    }
  }, {
    onSuccess: () => {
      // Invalidation des requêtes en cache après la mise à jour réussie
      if (dataInit) {
        queryClient.invalidateQueries(['liste-formateur', currentPage]);
      }
      if (dataRechercher) {
        queryClient.invalidateQueries(['formateur-search-formateur', currentPageRechercher]);
        setIsSearching(true);
      }
    },
  });

  // Fonction pour valider les données du formulaire avec les regex
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

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des erreurs de validation
    if (!regexError(formData)) {
      return;
    }
    // Mutation pour mettre à jour le formateur
    mutate(formData);
  };

  // Effacer les données du formulaire
  const clearFormData = () => {
    setFormData({
      matricule: '',
      nom: '',
      prenom: '',
      metier: '',
      email: '',
    });
    setErrorServer({});
  };

  return (
    <section className="formateur-section">
        <Helmet>
      <title>Modification-Formateur | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
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
              {errorServer.existeEMat && <span className='existData'>{errorServer.existeEMat}</span>}
              
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
              {errorServer.existeEMail && <span className='existData'>{errorServer.existeEMail}</span>}
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email ..."
              className={`inputClass ${errors.email || errorServer.existeEMail ? 'is-invalid-error' : errors.email === false ? 'is-valid-confirm' : ''}`}
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
            {isLoading ?  <Progress w={"25px"} h={"25px"} color={'white'} /> : 'Mettre à jour'}
          </Button>
        </div>
      </form>
    </section>
  );
}
