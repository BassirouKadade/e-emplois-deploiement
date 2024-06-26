import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { REGEX_REST,REGEX_EMAIL } from '../../../request/regex';
import '../../../styles/salle/modification.css';
import { useMutation, useQueryClient } from 'react-query';
import { updateUser } from '../../../request/userRequest/userRequest';
import Progress from '../../../components/Progess';
import { Helmet } from 'react-helmet';
export default function DirecteurMod({ openNotification, handleClose, currentPages: { totalPages, setIsSearching, currentPageRechercher, currentPage }, directeur }) {
  
  const [errors, setErrors] = useState({
    nom: false,
    prenom: false,
    email: false,
    password: false,
  });

  const dataInit = totalPages.datainit;
  const dataRechercher = totalPages.rechercher;

  const [errorServer, setErrorServer] = useState({});

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id:directeur?.id,
    nom: directeur?.nom, // Remplacer directeur.nom par la valeur correcte
    prenom: directeur?.prenom, // Remplacer directeur.prenom par la valeur correcte
    email: directeur?.email, // Remplacer directeur.email par la valeur correcte
    password: '', // Le mot de passe ne sera pas mis à jour ici
  });

  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await updateUser(data); // Mise à jour du directeur
      clearFormData();
      handleClose();
      openNotification();
    } catch (error) {
      setErrorServer(error.response.data);
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('verification-directeur-disponible'); // Invalidation du cache
      if (dataInit) {
        queryClient.invalidateQueries(['liste-user', currentPage]); // Invalidation du cache
      }
      if (dataRechercher) {
        queryClient.invalidateQueries(['search-user', currentPageRechercher]); // Invalidation du cache
        setIsSearching(true);
      }
    },
  });

  function regexError(data) {
    const newErrors = {
      nom: !REGEX_REST.test(data.nom),
      prenom: !REGEX_REST.test(data.prenom),
      email: !REGEX_EMAIL.test(data.email),
      password: !REGEX_REST.test(data.password),
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
      prenom: '',
      email: '',
      password: ''
    });
    setErrors({
      nom: false,
      prenom: false,
      email: false,
      password: false,
    });
    setErrorServer({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  return (
    <section style={{ width: "600px", padding: "0 30px" }} className="parentModule">
         <Helmet>
      <title>Modification-Directeur | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="module">
        <h3>Directeur</h3>
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
            <label className="label" htmlFor="prenom">
              <span>Prénom <span className="champsO">*</span></span>
              {errorServer.existePrenom && <span className='existData'>{errorServer.existePrenom}</span>}
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              placeholder="Prénom ..."
              onChange={handleInputChange}
              value={formData.prenom}
              className={`inputClass ${errors.prenom ? 'is-invalid-error' : !errors.prenom && formData.prenom ? 'is-valid-confirm' : ''}`}
            />
          </div>
        </div>
        <div className="moduleChild">
          <div className="info">
            <label className="label" htmlFor="email">
              <span>Email <span className="champsO">*</span></span>
              {errorServer.existEmail && <span className='existData'>{errorServer.existEmail}</span>}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email ..."
              onChange={handleInputChange}
              value={formData.email}
              className={`inputClass ${errors.email ? 'is-invalid-error' : !errors.email && formData.email ? 'is-valid-confirm' : ''}`}
            />
          </div>
          <div className="info">
            <label className="label" htmlFor="password">
              <span>Mot de passe <span className="champsO">*</span></span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Mot de passe ..."
              onChange={handleInputChange}
              value={formData.password}
              className={`inputClass ${errors.password ? 'is-invalid-error' : !errors.password && formData.password ? 'is-valid-confirm' : ''}`}
            />
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
