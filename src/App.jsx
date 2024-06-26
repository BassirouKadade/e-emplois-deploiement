import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SmileOutlined } from '@ant-design/icons';
import { App as AntdApp, message } from 'antd';
import ListeModule from './pages/module/liste/ListeModule';
import ListeFilieres from './pages/filiere/liste/ListeFilieres';
import ListeSalle from './pages/salle/liste/ListeSalle';
import ListeFormateurs from './pages/formateur/liste/ListeFormateurs';
import ListeGroupe from './pages/groupe/liste/ListeGroupe';
import CustomApp from './dashboard/menu/CustomApp';
import DetailFormateur from './pages/formateur/detail/DetailFormateur';
import OccupationJour from './pages/emplois/ocupationJour/OccupationJour';
import DetailGroupe from './pages/groupe/detail/DetailGroupe';
import ListeDirecteur from './pages/admin/directeur/ListeDirecteur';
import ListeEtablissement from './pages/admin/etablissement/ListeEtablissement';
import EtablissementDirecteur from './pages/admin/directeur/EtablissementDirecteur';
import NotFound from './services/NotFound';
import useStore from './store/useStore';
import PrivateRoute from './services/PrivateRoute';
import Login from './pages/auth/Login';
import Profile from './pages/auth/Profile';
import Progress from './components/Progess';
import ForgetPassword from './pages/auth/ForgetPassword';
import MessageSuccss from './pages/auth/MessageSuccess';
import ResetPassword from './pages/auth/ResetPassword';
import OneTimePassword from './pages/auth/OneTimePassword';
import GuestRoute from './services/GuestRoute';
import GuestOTP from './services/GuestOTP';
import ServerError from './services/SercerError';
import AdminPage from './dashboard/menu/AdminPage';
import LoginForm from './pages/auth/LoginForm';
const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const CreerEmplois = lazy(() => import('./pages/emplois/CreerEmplois'));

function MyApp() {

  const errorServer=useStore(state=>state.errorServer)
  const userAthToenExits = useStore(state => state.user);
  const isLogin = userAthToenExits && userAthToenExits.exp && userAthToenExits.exp * 1000 > Date.now();

  const { notification } = AntdApp.useApp();

  const showNotification = () => {
    notification.info({
      message: 'Actualiser la page',
      description: 'Si certaines mises à jour ne sont pas appliquées, veuillez actualiser la page. Merci!',
      icon: <SmileOutlined style={{ color: 'rgb(10, 148, 102)' }} />,
      duration: 5,
      placement: 'topRight',
    });
  };

  useEffect(() => {
   
    if(isLogin){
      setTimeout(showNotification,6000)
    }
  }, [isLogin]);

  const user =useStore.getState().user
const roles=user?.roles;
roles?.includes('Administrateur')

if(errorServer){
    return <ServerError></ServerError>
}
  return (
    <BrowserRouter>
      <Suspense fallback={<SunspotLoaderComponent />}>
        <Routes>
          <Route path="/" element={
            <GuestRoute component={LoginForm} />} />

          <Route path="/mot-de-passe-oublie" element={
             <GuestRoute component={ForgetPassword} />} />

          <Route path="/message-success" element={
             <GuestRoute component={MessageSuccss} />} />
          <Route path="/update-password/:token" element={
             <GuestRoute component={ResetPassword} />} />

          <Route path="/one-time-password" element={<GuestOTP  component={OneTimePassword} />} />
          
          
          <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />}>
            <Route index element={
              roles?.includes('Administrateur')&&  roles?.includes('Directeur')?<CustomApp />: 
              roles?.includes('Administrateur')? <AdminPage />: <CustomApp />
             
              } />
            <Route path="formateur/liste-formateur" element={<PrivateRoute component={ListeFormateurs} />} />
            <Route path="salle/liste-salle" element={<PrivateRoute component={ListeSalle} />} />
            <Route path="module/liste-module" element={<PrivateRoute component={ListeModule} />} />
            <Route path="filiere/liste-filiere" element={<PrivateRoute component={ListeFilieres} />} />
            <Route path="groupe/liste-groupe" element={<PrivateRoute component={ListeGroupe} />} />
            <Route path="formateur/detail-formateur/:id" element={<PrivateRoute component={DetailFormateur} />} />
            <Route path="groupe/detail-groupe/:id" element={<PrivateRoute component={DetailGroupe} />} />
            <Route path="directeur/directeur-liste" element={<PrivateRoute component={ListeDirecteur} />} />
            <Route path="directeur/etablissements-directeur/:id" element={<PrivateRoute component={EtablissementDirecteur} />} />
            <Route path="etablissement/etablissement-liste" element={<PrivateRoute component={ListeEtablissement} />} />
            <Route path="profile-user" element={<PrivateRoute component={Profile} />} />

          </Route>
          <Route path="/dashboard/creer-emploi" element={<PrivateRoute component={CreerEmplois} />} />
          <Route path="/dashboard/consulatation/occupation/:day" element={<PrivateRoute component={OccupationJour} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export const SunspotLoaderComponent = () => {
  return (
    <section style={{
       display:"flex",
       alignItem:"center",
       justifyContent:"center",
       width:"100%",
       height:"100vh",
       position:"relative"
       
    }}
    className="container-fluid"
    >
     <span style={{position:"absolute",top:"45%"}}>
     <Progress w={"35px"} h={"35px"} color={'rgb(0, 167, 111) '} />
     </span>
    </section>
  );
};

export default function App() {
  const currentIDSelected = useStore((state) => state.currentIDSelected);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let loadingMessage = null;

    if (currentIDSelected.chargement) {
      loadingMessage = messageApi.open({
        type: 'loading',
        content: 'Téléchargement en cours ...',
        duration: 0,
      });
    } else if (loadingMessage) {
      loadingMessage.then(() => {
        message.success('Téléchargement terminé', 0.5);
        message.info('Processus terminé', 0.5);
      });
    }

    return () => {
      if (loadingMessage) {
        loadingMessage();
      }
    };
  }, [currentIDSelected.chargement, messageApi]);

  return (
    <>
      {contextHolder}
      <AntdApp>
        <MyApp />
      </AntdApp>
    </>
  );
}
