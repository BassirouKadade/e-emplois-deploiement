import React from 'react';
import {  Navigate } from 'react-router-dom';
import useStore from '../store/useStore';

// Composant fonctionnel pour vérifier l'authentification
const GuestRoute = ({ component: Component, ...rest }) => {
  const user = useStore(state => state.user);
  const isLogin = user && user.exp && user.exp * 1000 > Date.now();

  return (
      isLogin
        ? <Navigate to='/dashboard' />
        : <Component {...rest} />
  );
};

export default GuestRoute;
