import React, {  useState } from 'react';
import Button from '@mui/material/Button';
import { REGEX_REST} from '../../../request/regex';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ajouterGroupe } from '../../../request/groupeRequest/groupeRequest';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { Helmet } from 'react-helmet';
import { listeFiliereAll } from '../../../request/filiereRequest/filiereRequest';
import Progress from '../../../components/Progess';

export default function NouveauGroupe() {
  const [formErrors, setFormErrors] = useState({
    code: false,
    description: false,
    id_filiere: false
  });

  const [notificationAPI, notificationHolder] = notification.useNotification();

  const openNotification = () => {
    notificationAPI.open({
      placement: "topLeft",
      message: 'Nouveau groupe',
      description: 'Groupe créé avec succès',
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
    code: '',
    description: '',
    id_filiere: ''
  });

  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      await ajouterGroupe(data);
      clearFormData();
      openNotification();
    } catch (error) {
      setServerError(error.response?.data || {});
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(['liste-groupes', 1]);
    },
  });

  function validateFormData(data) {
    let hasError = false;

    const newErrors = {
      code: !REGEX_REST.test(data.code),
      description: data.description ? !REGEX_REST.test(data.description) : false, // Validation seulement si la description n'est pas vide
      id_filiere: !data.id_filiere // Ensuring id_filiere is not empty
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
      code: '',
      description: '',
      id_filiere: ''
    });
    setFormErrors({
      code: false,
      description: false,
      id_filiere: false
    });
    setServerError({});
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
    <section className="parentModule">
         <Helmet>
      <title>Ajouter-Groupe | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
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
              {serverError.existeCode && <span className='existData'>{serverError.existeCode}</span>}
            </label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Nom ..."
              onChange={handleInputChange}
              value={formData.code}
              className={`inputClass ${formErrors.code ? 'is-invalid-error' : !formErrors.code && formData.code ? 'is-valid-confirm' : ''}`}
            />
          </div>
          
          <div className="info">
            <label className="label" htmlFor="id_filiere">
              <span>Filiere <span className="champsO">*</span></span>
              {serverError.existeFiliere && <span className='existData'>{serverError.existeFiliere}</span>}
            </label>
            <select
              type="text"
              id="id_filiere"
              name="id_filiere"
              placeholder="ID Filiere ..."
              onChange={handleInputChange}
              value={formData.id_filiere}
              className={`inputClass ${formErrors.id_filiere ? 'is-invalid-error' : !formErrors.id_filiere && formData.id_filiere ? 'is-valid-confirm' : ''}`}
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
          <div className="info infoDescription" style={{width:"100%"}}>
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
              className={`inputClass ${formErrors.description ? 'is-invalid-error' : !formErrors.description && formData.description ? 'is-valid-confirm' : ''}`}
            >
            </textarea>
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
