import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { REGEX_REST, } from '../../../request/regex';
import { useMutation, useQueryClient } from 'react-query';
import { ajouterFiliere } from '../../../request/filiereRequest/filiereRequest';
import Progress from '../../../components/Progess';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { Helmet } from 'react-helmet';
import '../../../styles/filiere/nouvelleFilieres.css'
export default function NouvelleFiliere() {
  const [errors, setErrors] = useState({
    code: false,
    niveau: false,
    description: false,
  });

  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      placement: "topLeft",
      message: 'Nouvelle Filière', // Modification du message de notification
      description: 'Filière créée avec succès', // Modification de la description de notification
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
    code: '',
    niveau: '',
    description: '',
  });

  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await ajouterFiliere(data); // Utilisation de la fonction de requête de création de filière
      clearFormData();
      openNotification();
    } catch (error) {
      setErrorServer(error.response.data);
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['liste-filiere',1]); // Invalidations des requêtes relatives à la liste des filières
    },
  });

  function regexError(data) {
    let hasError = false;

    if (!REGEX_REST.test(data.code)) {
      setErrors(prev => ({ ...prev, code: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, code: false }));
    }

    if (!REGEX_REST.test(data.niveau)) {
      setErrors(prev => ({ ...prev, niveau: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, niveau: false }));
    }

    if (!REGEX_REST.test(data.description)) {
      setErrors(prev => ({ ...prev, description: true }));
      hasError = true;
    } else {
      setErrors(prev => ({ ...prev, description: false }));
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
      code: '',
      niveau: '',
      description: '',
    });
    setErrorServer({});
  };

  return (
    <section className="parentFiliere"> {/* Modification de la classe parente */}
        {contextHolder}
        <Helmet>
      <title>Ajouter-Filiere | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="filiere"> {/* Modification de la classe du div */}
        <h3 id="Text">Filière</h3>
      </div>
      <form onSubmit={handleSubmit} className="filiere"> {/* Modification de la classe du formulaire */}
        <article className="filiereChild"> {/* Modification de la classe de l'article */}
          <div className="info">
            <label className="label" htmlFor="code"> {/* Modification du htmlFor et du label */}
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
            <label className="label" htmlFor="niveau"> {/* Modification du htmlFor et du label */}
              <span>Niveau <span className="champsO">*</span></span>
            </label>
            <select
              type="text"
              id="niveau" 
              name="niveau"
              placeholder="Niveau ..."
              className={`inputClass ${errors.niveau ? 'is-invalid-error' : errors.niveau === false ? 'is-valid-confirm' : ''}`}
              value={formData.niveau}
              onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
            >
                 <option value="">Niveau</option>
                <option value="1">1ère Année</option>
                <option value="2">2eme Année</option>
            </select>
          </div>
        </article>

        <article className="filiereChild"> {/* Modification de la classe de l'article */}
          <div className="info infoDescription" style={{width:"100%"}}> {/* Modification de la classe de div */}
            <label className="label" htmlFor="description"> {/* Modification du htmlFor et du label */}
            <span>Description <span className="champsO">*</span></span>
              {errorServer.existeDescription && <span className='existData'>{errorServer.existeDescription}</span>}
            </label>
            <textarea
              type="text"
              id="description" 
              name="description"
              placeholder="Description ..."
              className={`inputClass ${errors.description || errorServer.existeDescription ? 'is-invalid-error' : errors.description === false ? 'is-valid-confirm' : ''}`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </article>
        <div className="filiereChild buttonF"> {/* Modification de la classe de div */}
          <Button type="submit" className="buttonMbut articleButton" disabled={isLoading}>
            {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} />  : 'Ajouter'}
          </Button>
        </div>
      </form>
    </section>
  );
}
