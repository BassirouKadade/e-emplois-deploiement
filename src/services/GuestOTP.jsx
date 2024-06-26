import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';

// Composant fonctionnel pour vérifier l'authentification
const GuestOTP = ({ component: Component, ...rest }) => {
  const { user, userAuth } = useStore(state => ({
    user: state.user,
    userAuth: state.userAuth,
  }));

  const isLogin = user && user.exp && user.exp * 1000 > Date.now();
  const isLoginAuth = userAuth && userAuth.exp && userAuth.exp * 1000 > Date.now();

  return (
    isLogin ? (
      <Navigate to="/dashboard" />
    ) : isLoginAuth ? (
      <Component {...rest} />
    ) : (
      <Navigate to="/" />
    )
  );
};

export default GuestOTP;
