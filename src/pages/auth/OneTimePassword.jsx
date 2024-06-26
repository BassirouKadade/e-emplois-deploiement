import React, { useState, useRef, useEffect } from "react";
import { CiCircleAlert } from "react-icons/ci";
import { useMutation } from "react-query";
import { verifiy_user, resendMemail_ } from "../../request/authRequest/authRequest";
import Progress from "../../components/Progess";
import { getEmail } from "../../services/authUntils";
import Logo from '../../assets/E-Emplois22_no_bg.svg';
import { Helmet } from "react-helmet";
import '../../styles/auth/auth.css';
import { SmileOutlined } from '@ant-design/icons';
import {  notification } from 'antd';
import { setSecureLocalStorageItem } from "../../services/authUntils";
export default function OneTimePassword() {
  const inputs = useRef([]);
  const [data, setData] = useState(Array(6).fill(""));
  const [errorMessages, setErrorMessages] = useState(Array(6).fill(""));
  const [serverError, setServerError] = useState({});

  useEffect(() => {
    const filledIndex = data.findIndex(value => !value);
    if (filledIndex !== -1 && inputs.current[filledIndex]) {
      inputs.current[filledIndex].focus();
      setServerError(null)
    }
  }, [data]);

  const validateData = () => {
    let isValid = true;
    const newErrorMessages = Array(6).fill("");
    data.forEach((value, index) => {
      if (!value) {
        newErrorMessages[index] = "Veuillez fournir une valeur.";
        isValid = false;
      }
    });
    setErrorMessages(newErrorMessages);
    return isValid;
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    setData(prevData => {
      const newData = [...prevData];
      newData[index] = value;
      return newData;
    });
    setErrorMessages(prevErrors => {
      const newErrors = [...prevErrors];
      newErrors[index] = "";
      return newErrors;
    });
  };

  const [isLoadingToken,setIsloadingToken]=useState(false)
  const handleResend = async (e) => {
    e.preventDefault();
    try {
      setIsloadingToken(true)
       await resendMemail_({
        email:getEmail()
      });
      openNotification()
    } catch (error) {
      console.error('Une erreur est survenue ....', error);
    }
    finally{
      setIsloadingToken(false)
    }
  };

  const { mutate, isLoading } = useMutation(
    async (data) => {
      const response = await verifiy_user(data);
      setSecureLocalStorageItem('_data_user_', response?.data);
      return response.data;
    },
    {
      onSuccess: () => {
       window.location.href="/dashboard"
      },
      onError: (error) => {
        setServerError(error.error);
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateData()) {
      mutate({
        token: data.join(''),
        email: getEmail()
      });
    }
  };

  
  const [api, contextHolder] = notification.useNotification();
 
  const openNotification = () => {
    api.open({
      placement: "topRight",
      message: 'Le code de vérification',
      description: 'Un nouveau code de vérification a été envoyé.',
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

  return (
    <section className="section container-fluid">
      {contextHolder}
      <article className="sous-section-otp" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", backgroundColor: "#fff", width: '480px', height: '500px', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <Helmet>
          <title>Verification d'Email | E-Emplois</title>
          <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
          <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
          <meta name="author" content="Votre nom ou nom de l'organisation" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <div className="logo-container" style={{ textAlign: 'center' }}>
          <img width={'110px'} height={'110px'} src={Logo} alt="Logo E-Emplois" />
        </div>
        <div className="divOneOTP" style={{ textAlign: 'center', margin: '20px 0' }}>
          <h5 style={{ fontSize: "19px", textTransform: "uppercase" }}>Confirmation de votre adresse</h5>
          <hr />
          <p>Nous avons envoyé un code de vérification à <strong>{getEmail()}</strong>. Veuillez entrer le code ci-dessous pour vérifier votre adresse email.</p>
        </div>
        <form onSubmit={handleSubmit} className="formOTP" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "100%", textAlign: 'center' }}>
          <div className="otpDiv" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {data.map((val, index) => (
              <input
                key={index}
                ref={el => inputs.current[index] = el}
                value={val}
                onChange={(e) => handleChange(e, index)}
                className="otpInput"
                type="text"
                maxLength="1"
                style={{
                  width: '40px',
                  height: '40px',
                  textAlign: 'center',
                  fontSize: '18px',
                  border: errorMessages[index] || serverError? "1px solid red" : "1px solid rgba(12, 144, 201, 0.753)",
                  borderRadius: '5px'
                }}
              />
            ))}
          </div>
          {serverError?.invalid_code && <span className="errorText" style={{ color: 'red', marginTop: '10px', display: 'block' }}>{serverError?.invalid_code}</span>}
          <button type="submit" className="liens button liens1" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: isLoading ? "rgba(29, 120, 120, 0.595)" : "", border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer' }} disabled={isLoading}>
            {isLoading ? <Progress w={"25px"} h={"25px"} color={'white'} /> : "Vérifier votre adresse courriel"}
          </button>
        </form>
        <p className="resendMe" style={{display:"flex",alignItems:"center",  marginTop: '20px', textAlign: 'center' }}>
          <CiCircleAlert style={{ marginRight: 3 }} />
          <span>Vous n'avez pas reçu le code?</span>
          <form  onSubmit={handleResend} style={{ display: 'flex',alignItems:"center", marginLeft: '5px' }}>
          {isLoadingToken?<Progress w={"16px"} h={"16px"} color={'rgb(0, 167, 111)'} /> :    <button className="text-primary resend" type="submit" style={{ background: "transparent", border: 'none', color: '#0c90c9', cursor: 'pointer' }}>Envoyez-moi un nouveau code</button>}
          </form>
        </p>
      </article>
    </section>
  );
}
