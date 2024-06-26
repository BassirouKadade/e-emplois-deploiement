import { useState } from 'react';
import Button from '@mui/material/Button';
import { REGEX_REST, } from '../../../request/regex';
import { useMutation, useQueryClient } from 'react-query';
import '../../../styles/filiere/modification.css'
import { updateFiliere } from '../../../request/filiereRequest/filiereRequest';
import Progress from '../../../components/Progess';
import { Helmet } from 'react-helmet';
export default function FiliereMod({ openNotification, handleClose, currentPages: { totalPages, setIsSearching, currentPageRechercher, currentPage }, filiere }) {
  // State pour gérer les erreurs de validation
  const [errors, setErrors] = useState({
    code: false,
    niveau: false,
    description: false,
  });

  // Récupération des données initiales et de recherche
  const dataInit = totalPages.datainit;
  const dataRechercher = totalPages.rechercher;

  // State pour gérer les erreurs serveur
  const [errorServer, setErrorServer] = useState({});
  const queryClient = useQueryClient();

  // State pour stocker les données du formulaire
  const [formData, setFormData] = useState(filiere);

  // Mutation pour mettre à jour la filière
  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await updateFiliere(data);
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
        queryClient.invalidateQueries(['liste-filiere', currentPage]);
      }
      if (dataRechercher) {
        queryClient.invalidateQueries(['filiere-search', currentPageRechercher]);
        setIsSearching(true);
      }
    },
  });

  // Fonction pour valider les données du formulaire avec les regex
  function regexError(data) {
    let hasError = false;

    if (!REGEX_REST.test(data.code)) {
      setErrors(prev => ({ ...prev, code: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, code: false }));
    }

    if (!data.niveau) {
      setErrors(prev => ({ ...prev, niveau: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, niveau: false }));
    }

    if (!data.description) {
      setErrors(prev => ({ ...prev, description: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, description: false }));
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
    // Mutation pour mettre à jour la filière
    mutate(formData);
  };

  // Effacer les données du formulaire
  const clearFormData = () => {
    setFormData({
      code: '',
      niveau: '',
      description: '',
    });
    setErrorServer({});
  };

  return (
    <section  style={{width:"600px",padding:"0 30px"}} className="parentFiliere">
         <Helmet>
      <title>Modification-Filiere | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="filiere">
        <h3 id="Text">Filière</h3>
      </div>
      <form onSubmit={handleSubmit} className="filiere">
        <article className="filiereChild">
          <div className="info">
            <label className="label" htmlFor="code">
              <span>Code <span className="champsO">*</span></span>
              {errorServer.existCode && <span className='existData'>{errorServer.existCode}</span>}
            </label>
            <input
              type="text"
              id="code" 
              name="code"
              placeholder="Code ..."
              className={`inputClass ${errors.code || errorServer.existCode ? 'is-invalid-error' : errors.code === false ? 'is-valid-confirm' : ''}`}
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>

          <div className="info">
            <label className="label" htmlFor="niveau">
              <span>Niveau <span className="champsO">*</span></span>
            </label>
            <select
              id="niveau"
              name="niveau"
              className={`inputClass ${errors.niveau ? 'is-invalid-error' : errors.niveau === false ? 'is-valid-confirm' : ''}`}
              value={formData.niveau}
              onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
            >
              <option value="">Niveau</option>
              <option value="1">1ère Année</option>
              <option value="2">2ème Année</option>
            </select>
          </div>
        </article>

        <article className="filiereChild">
          <div className="info infoDescription" style={{width:"100%"}}>
            <label className="label" htmlFor="description">
              <span>Description <span className="champsO">*</span></span>
              {errorServer.existDescription && <span className='existData'>{errorServer.existDescription}</span>}
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description ..."
              className={`inputClass ${errors.description || errorServer.existDescription ? 'is-invalid-error' : errors.description === false ? 'is-valid-confirm' : ''}`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </article>
        <div className="filiereChild buttonF">
          <Button type="submit" className="buttonMbut articleButton" disabled={isLoading}>
            {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} />  : 'Mettre à jour'}
          </Button>
        </div>
      </form>
    </section>
  );
}
