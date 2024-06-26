import React, { useState, useEffect } from 'react';
import { Avatar, Button, Upload, message, notification } from 'antd';
import { UploadOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import './Profile.css';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getInfoUserAuth } from '../../request/userRequest/userRequest';
import { updateProfile } from '../../request/authRequest/authRequest';
import { REGEX_EMAIL } from '../../request/regex';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Progress from '../../components/Progess';
import Logo from '../../assets/User-Avatar-Profile-PNG-Photos.png';
const baseURL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const [formErrors, setFormErrors] = useState({
    nom: false,
    prenom: false,
    email: false,
    motDePasse: false
  });

  const [notificationAPI, notificationHolder] = notification.useNotification();

  const openNotification = () => {
    notificationAPI.open({
      placement: "topRight",
      message: 'Profil mis à jour',
      description: 'Votre profil a été mis à jour avec succès',
      icon: <SmileOutlined style={{ color: 'rgb(0, 167, 111)' }} />,
      duration: 2,
    });
  };

  const [serverError, setServerError] = useState({});

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    image: null,
    id: null
  });

  const { mutate, isLoading } = useMutation(async (data) => {
    const formData = new FormData();
    formData.append('nom', data.nom);
    formData.append('prenom', data.prenom);
    formData.append('email', data.email);
    formData.append('motDePasse', data.motDePasse);
    formData.append('image', data.image);
    formData.append('id', data.id);
    try {
     const response= await updateProfile(formData);
     if(response.status===200){
      openNotification();
      clearFormData();
     }
    } catch (error) {
      setServerError(error.response?.data || {});
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('get-info-user-auth');
    },
  });

  function validateFormData(data) {
    const newErrors = {
      nom: !data.nom,
      prenom: !data.prenom,
      email: !REGEX_EMAIL.test(data.email),
    };

    setFormErrors(newErrors);

    return Object.values(newErrors).every(error => !error);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData(formData)) {
      return;
    }
    mutate(formData);
  };

  const clearFormData = () => {
    setFormErrors({
      nom: false,
      prenom: false,
      email: false,
    });
    setServerError({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [fileList, setFileList] = useState([]);

  const beforeUpload = (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxFileSizeMB = 10;

    const isAllowedType = allowedTypes.includes(file.type);

    if (!isAllowedType) {
      message.error(`${file.name} n'est pas un fichier PNG, JPEG, JPG ou PDF`);
      return false;
    }

    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxFileSizeMB) {
      message.error(`${file.name} dépasse la taille maximale autorisée de ${maxFileSizeMB} MB`);
      return false;
    }

    return true;
  };

  const onChange = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.slice(-1);

    if (fileList.length > 0) {
      const fileToUpload = fileList[0].originFileObj;
      setFileList([fileToUpload]);
    }
  };

  const { data: getInfoUserAuthData, isLoading: isLoadingGetInfoUserAuth } = useQuery('get-info-user-auth',
    async () => {
      try {
        const response = await getInfoUserAuth();
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

  useEffect(() => {
    if (getInfoUserAuthData) {
      setFormData(prev => ({
        ...prev,
        id: getInfoUserAuthData.id,
        nom: getInfoUserAuthData.nom,
        prenom: getInfoUserAuthData.prenom,
        email: getInfoUserAuthData.email
      }));
    }
  }, [getInfoUserAuthData]);

  useEffect(() => {
    if (fileList) {
      setFormData(prev => ({
        ...prev,
        image: fileList.length > 0 ? fileList[0] : null
      }));
    }
  }, [fileList]);

  return (
    <section className="profile-section">
      {notificationHolder}

      <Helmet>
        <title>Profile-utilisateur | E-Emplois</title>
        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="text-profile">Profile</div>
      <article className="profile-article">
        {!isLoadingGetInfoUserAuth && getInfoUserAuthData ? (
          <div className="avatar-container">
            <Avatar
              style={{ marginBottom: "2px" }}
              size={128}
              icon={<UserOutlined />}
              src={fileList.length > 0 ? URL.createObjectURL(fileList[0]) :!!baseURL+"/"+getInfoUserAuthData.photo?baseURL+"/"+getInfoUserAuthData.photo:Logo}
            />
            <Upload
              beforeUpload={beforeUpload}
              onChange={onChange}
              fileList={fileList}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Changer Photo</Button>
            </Upload>
          </div>
        ) : (
          <Skeleton className="avatar-container" baseColor='#f7f7f7' highlightColor='#fff' style={{ borderRadius: "50%", margin: "5px 0", width: "260px", height: "260px" }} />
        )}

        <form style={{ marginLeft: "30px", width: "65%" }} onSubmit={handleSubmit}>
          {isLoadingGetInfoUserAuth && !getInfoUserAuthData ? (
            <div style={{ padding: 0, width: "100%" }}>
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <Skeleton key={index} baseColor='#f7f7f7' highlightColor='#ebebeb' style={{ margin: "5px 0", width: "100%", height: "45px" }} />
              ))}
            </div>
          ) : (
            <>
              <div className="moduleChild">
                <div className="info">
                  <label className="label" htmlFor="nom">
                    <span>Nom <span className="champsO">*</span></span>
                    {serverError.nom && <span className='existData'>{serverError.nom}</span>}
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
                  <label className="label" htmlFor="prenom">
                    <span>Prénom <span className="champsO">*</span></span>
                    {serverError.prenom && <span className='existData'>{serverError.prenom}</span>}
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    placeholder="Prénom ..."
                    onChange={handleInputChange}
                    value={formData.prenom}
                    className={`inputClass ${formErrors.prenom ? 'is-invalid-error' : !formErrors.prenom && formData.prenom ? 'is-valid-confirm' : ''}`}
                  />
                </div>
              </div>

              <div className="moduleChild">
                <div className="info" style={{ width: "100%" }}>
                  <label className="label" htmlFor="email">
                    <span>Email <span className="champsO">*</span></span>
                    {serverError.email && <span className='existData'>{serverError.email}</span>}
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="Email ..."
                    onChange={handleInputChange}
                    value={formData.email}
                    className={`inputClass ${formErrors.email ? 'is-invalid-error' : !formErrors.email && formData.email ? 'is-valid-confirm' : ''}`}
                  />
                </div>
              </div>

              <div className="moduleChild">
                <div className="info" style={{ width: "100%" }}>
                  <label className="label" htmlFor="motDePasse">
                    <span>Mot de passe </span>
                    {serverError.motDePasse && <span className='existData'>{serverError.motDePasse}</span>}
                  </label>
                  <input
                    type="password"
                    id="motDePasse"
                    name="motDePasse"
                    placeholder="Mot de passe ..."
                    onChange={handleInputChange}
                    value={formData.motDePasse}
                    className={`inputClass ${formErrors.motDePasse ? 'is-invalid-error' : !formErrors.motDePasse && formData.motDePasse ? 'is-valid-confirm' : ''}`}
                  />
                </div>
              </div>

              <div className="moduleChild">
                <button type="submit" className="buttonMbut articleButton" disabled={isLoading}>
                  {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} /> : 'Mettre à jour'}
                </button>
              </div>
            </>
          )}
        </form>
      </article>
    </section>
  );
};

export default Profile;
