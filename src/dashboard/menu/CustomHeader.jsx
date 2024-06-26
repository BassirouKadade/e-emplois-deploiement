import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdAssignment, MdExitToApp } from 'react-icons/md';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import { handleLogout } from '../../services/authUntils';
import { useNavigate } from 'react-router-dom';
import { useQuery ,useMutation} from 'react-query';
import { reinitialisationEspaceEmploisFormateur } from '../../request/createEmploisRequest/createEmploisRequest';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {  Modal, Space } from 'antd';
import { getInfoUserAuth } from '../../request/userRequest/userRequest';
import Logo from '../../assets/User-Avatar-Profile-PNG-Photos.png'
import {   MdHome, MdPerson } from 'react-icons/md';

import { ExclamationCircleFilled } from '@ant-design/icons';
const { confirm } = Modal;

const baseURL = import.meta.env.VITE_BASE_URL;

const { Header } = Layout;

const ITEM_HEIGHT = 48;

export default function CustomHeader() {
  const collapsed = useStore(state => state.collapsed);
  const user =useStore.getState().user
  const roles=user.roles;

  const toggleCollapsed = useStore(state => state.toggleCollapsed);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // **********************
// *************
// MODAL POUR REINITIALISATION


const ReinitialisationFormMutation = useMutation(
  'reinitialisation-app-espacedetravail', 
  reinitialisationEspaceEmploisFormateur,
  {
    onSuccess: () => {
      handleLogout(); 
      window.location.href = "/";
    }
  }
);

const showPromiseConfirm = () => {
  confirm({
    title: 'Voulez-vous réinitialiser votre espace ?', // Titre de la boîte de dialogue
    icon: <ExclamationCircleFilled />, // Icône affichée dans la boîte de dialogue
    content: (
      <div>
        <p style={{ margin: 0 }}>Note : Cela va affecter la restauration de l'état actuel d'avancement et de tous les groupes.</p>
      </div>
    ),
    okText: 'OK', // Texte du bouton OK
    okButtonProps: {
      style: {
        backgroundColor: 'rgb(0,167,111)', // Couleur de fond du bouton OK
        color: 'white', // Couleur du texte du bouton OK
      },
    },
    cancelText: 'Annuler', // Texte du bouton Annuler
    onOk() {
      return ReinitialisationFormMutation.mutate(); // Appeler mutate ici
    },
  });
};


  const OptionLink = ({ to, icon: Icon, text, style }) => (
    <Link to={to} style={{ textDecoration: "none", color: "rgb(0, 167, 111)", ...style }}>
      <div style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
        <Icon style={{ fontSize: "18px", marginRight: "7px" }} /> {text}
      </div>
    </Link>
  );
  
  const OptionButton = ({ onClick, icon: Icon, text, style }) => (
    <div
      onClick={onClick}
      style={{ fontSize: "16px", display: "flex", alignItems: "center", cursor: "pointer", ...style }}
    >
      <Icon style={{ color: "rgb(10, 148, 102)", marginRight: "7px" }} /> {text}
    </div>
  );
  
  const options = [
    {
      id: 1,
      component: <OptionLink to="/dashboard/profile-user" icon={MdPerson} text="Profil" />
    },
    {
      id: 3,
      component: <OptionButton onClick={() => { handleLogout(); window.location.href = "/"; }} icon={MdExitToApp} text="Déconnecter" />
    },
    roles.includes('Directeur') && {
      id: 2,
      component: <OptionButton onClick={showPromiseConfirm}  icon={MdHome} text="Réinitialiser le système" />
    },
  ].filter(Boolean); // Filter out any false values, like the 'Directeur' option if roles doesn't include 'Directeur'
  


const { data: getInfoUserAuthData } = useQuery('get-info-user-auth',
  async () => {
    try {
      const response = await getInfoUserAuth();
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });


  return (
    <Header className='header-custom-header'>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        className="header-button"
      />
      <div className="info-profile-nav">
        <div className="notification-settings-user-icons">
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            style={{padding:"5px 0"}}
            onClick={handleClick}
          >
            <Avatar sx={{ margin: "0 5px", width: 35, height: 35, fontSize: 15 }} alt="Avatar" src={!!baseURL+"/"+getInfoUserAuthData?.photo?baseURL+"/"+getInfoUserAuthData?.photo:Logo} />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: roles.includes('Directeur')?"28ch":"20ch",
              },
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.id} onClick={handleClose}>
                {option.component}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    </Header>
  );
}


