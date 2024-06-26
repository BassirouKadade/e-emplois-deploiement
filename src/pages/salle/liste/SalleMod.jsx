import { useState,useEffect } from 'react'; // Importation des hooks de React
import Button from '@mui/material/Button'; // Importation du composant Button de Material-UI
import { REGEX_REST } from '../../../request/regex';
import '../../../styles/salle/modification.css'
import { useMutation, useQueryClient } from 'react-query'; // Importation des hooks de react-query pour gérer les mutations et le cache
import { updateSalle } from '../../../request/salleRequest/salleRequest';
import Progress from '../../../components/Progess';
import { Helmet } from 'react-helmet';
// Composant principal pour la modification d'une salle
export default function SalleMod({ openNotification, handleClose, currentPages: { totalPages, setIsSearching, currentPageRechercher, currentPage }, salle }) {

  // État pour suivre les erreurs de validation
  const [errors, setErrors] = useState({
    nom: false,
    capacite: false,
    MH: false,
    MREST: false,
  });

  // Données initiales et de recherche provenant des props
  const dataInit = totalPages.datainit;
  const dataRechercher = totalPages.rechercher;

  // État pour les erreurs du serveur
  const [errorServer, setErrorServer] = useState({});

  // Instance de QueryClient de React Query pour la gestion du cache
  const queryClient = useQueryClient();

  // État pour les données du formulaire
  const [formData, setFormData] = useState(salle);

  // Mutation pour gérer la mise à jour de la salle
  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await updateSalle(data); // Tente de mettre à jour la salle
      clearFormData(); // Efface les données du formulaire en cas de succès
      handleClose(); // Ferme le formulaire/modal
      openNotification(); // Ouvre une notification pour indiquer le succès
    } catch (error) {
      setErrorServer(error.response.data); // Définit les erreurs du serveur
    }
  }, {
    onSuccess: () => {
      // Invalide les requêtes en cache après une mise à jour réussie
        queryClient.invalidateQueries('verification-salle-disponible');
      if (dataInit) {
        queryClient.invalidateQueries(['liste-salle', currentPage]);
      }
      if (dataRechercher) {
        queryClient.invalidateQueries(['search-salle', currentPageRechercher]);
        setIsSearching(true);
      }
    },
  });

  // Fonction pour vérifier les erreurs de validation avec une regex
  function regexError(data) {
    const newErrors = {
      nom: !REGEX_REST.test(data.nom),
      capacite: !REGEX_REST.test(data.capacite),
      MH: !REGEX_REST.test(data.MH),
      MREST: !REGEX_REST.test(data.MREST),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error); // Vérifie s'il n'y a pas d'erreurs
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
      nom: '',
      capacite: 25,
      MH: '',
      MREST: formData.MH,
      emplacement: '',
    });
    setErrors({
      nom: false,
      capacite: false,
      MH: false,
      MREST: false,
    });
    setErrorServer({});
  };

  // Gère les changements dans les champs de saisie
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(()=>{
    setFormData(prev=>({...prev,MREST:prev.MH}))
},[formData])

  return (
    <section style={{ width: "600px", padding: "0 30px" }} className="parentModule">
        <Helmet>
      <title>Modification-Salle | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
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
              className={`inputClass ${errors.capacite ? 'is-invalid-error' : !errors.capacite && formData.capacite ? 'is-valid-confirm' : ''}`}
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
              className={`inputClass ${errors.MH ? 'is-invalid-error' : !errors.MH && formData.MH ? 'is-valid-confirm' : ''}`}
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
              className={`inputClass ${errors.MREST ? 'is-invalid-error' : !errors.MREST && formData.MREST ? 'is-valid-confirm' : ''}`}
            />
          </div>
        </div>
        <div className="moduleChild">
          <div className="info infoDescription">
            <label className="label" htmlFor="emplacement">
              <span>Emplacement ( faculative )</span>
              {errorServer.existeEmplacement && <span className='existData'>{errorServer.existeEmplacement}</span>}
            </label>
            <textarea
              id="emplacement"
              name="emplacement"
              placeholder="Emplacement de la salle"
              onChange={handleInputChange}
              value={formData.emplacement}
              style={{ resize: "none" }}
              className={`inputClass ${errors.emplacement ? 'is-invalid-error' : ''}`}
            ></textarea>
          </div>
        </div>
        <div className="moduleChild">
          <Button type="submit" className="buttonMbut articleButton" disabled={isLoading}>
            {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} /> : 'Mettre à jour'}
          </Button>
        </div>
      </form>
    </section>
  );
}
