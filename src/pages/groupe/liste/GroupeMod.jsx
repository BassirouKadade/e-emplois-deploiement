import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { REGEX_REST} from '../../../request/regex';
import { useMutation,useQuery, useQueryClient } from 'react-query';
import { updateGroupe } from '../../../request/groupeRequest/groupeRequest';
import Progress from '../../../components/Progess';
import { Helmet } from 'react-helmet';
import { listeFiliereAll } from '../../../request/filiereRequest/filiereRequest';
export default function SalleMod({ openNotification, handleClose, currentPages: { totalPages, setIsSearching, currentPageRechercher, currentPage }, salle }) {
  
  const [errors, setErrors] = useState({
    code: false,
    description: false,
    id_filiere: false
  });

  const dataInit = totalPages.datainit;
  const dataRechercher = totalPages.rechercher;

  const [errorServer, setErrorServer] = useState({});
  
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(salle);

  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await updateGroupe(data);
      clearFormData();
      handleClose();
      openNotification();
    } catch (error) {
      setErrorServer(error.response.data);
    }
  }, {
    onSuccess: () => {
      if (dataInit) {
        queryClient.invalidateQueries(['liste-groupes', currentPage]);
      }
      if (dataRechercher) {
        queryClient.invalidateQueries(['search-groupes', currentPageRechercher]);
        setIsSearching(true);
      }
    },
  });

  function regexError(data) {
    const newErrors = {
      code: !REGEX_REST.test(data.code),
      description: data.description ? !REGEX_REST.test(data.description) : false, // Validation seulement si la description n'est pas vide
      id_filiere: !data.id_filiere
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
      code: '',
      description: '',
      id_filiere: ''
    });
    setErrors({
      code: false,
      description: false,
      id_filiere: false
    });
    setErrorServer({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const { data, isLoading:isLoadingListeFiliere } = useQuery(['liste-filieres-all'], async () => {
    try {
      const response = await listeFiliereAll();
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  return (
    <section style={{width:"600px",padding:"0 30px"}}  className="parentModule">
         <Helmet>
      <title>Modification-Groupe | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="module">
        <h3>Groupe</h3>
      </div>
      <form className="formModule" onSubmit={handleSubmit}>
        <div className="moduleChild">
          <div className="info">
            <label className="label" htmlFor="code">
              <span>Code de groupe <span className="champsO">*</span></span>
              {errorServer.existeCode && <span className='existData'>{errorServer.existeCode}</span>}
            </label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Nom ..."
              onChange={handleInputChange}
              value={formData.code}
              className={`inputClass ${errors.code ? 'is-invalid-error' : !errors.code && formData.code ? 'is-valid-confirm' : ''}`}
            />
          </div>
          
          <div className="info">
            <label className="label" htmlFor="id_filiere">
              <span>Filiere <span className="champsO">*</span></span>
              {errorServer.existeFiliere && <span className='existData'>{errorServer.existeFiliere}</span>}
            </label>
            <select
              type="text"
              id="id_filiere"
              name="id_filiere"
              placeholder="ID Filiere ..."
              onChange={handleInputChange}
              value={formData.id_filiere}
              className={`inputClass ${errors.id_filiere ? 'is-invalid-error' : !errors.id_filiere && formData.id_filiere ? 'is-valid-confirm' : ''}`}
            >
              {isLoadingListeFiliere && !data ? "chargement" :
                <>
                  <option value="">Filiere</option>
                  {data.map((filiere, index) => (
                    <option key={index} value={filiere.id}>{filiere.description}</option>
                  ))}
                </>
              }
            </select>
          </div>
        </div>
        <div className="moduleChild">
          <div className="info infoDescription"  style={{width:"100%"}}>
            <label className="label" htmlFor="description">
              <span>Description (facultatif)</span>
            </label>
            <textarea
              type="text"
              id="description"
              name="description"
              placeholder="Description ..."
              onChange={handleInputChange}
              value={formData.description}
              className={`inputClass ${errors.description ? 'is-invalid-error' : !errors.description && formData.description ? 'is-valid-confirm' : ''}`}
            >
            </textarea>
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
