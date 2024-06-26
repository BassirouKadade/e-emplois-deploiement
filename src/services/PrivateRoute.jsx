import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import useStore from '../store/useStore';

// Composant fonctionnel pour vérifier l'authentification
const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useStore(state => state.user);
  const isLogin = user && user.exp && user.exp * 1000 > Date.now();
  return (
      isLogin
        ? <Component {...rest} />
        : <Navigate to='/' />
  );
};

export default PrivateRoute;
