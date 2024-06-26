import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import CustomHeader from './menu/CustomHeader';
import CustomMenu from './menu/CustomMenu';
import '../styles/dashboard/dashboard.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useStore from '../store/useStore';
import { MdPrint, MdPerson, MdGroup, MdMeetingRoom } from 'react-icons/md';
import { Helmet } from 'react-helmet';

const ITEM_HEIGHT = 48;

const { Content } = Layout;

const Dashboard = () => {
  const toglleCurrentElementToDownload = useStore(state => state.toglleCurrentElementToDownload);
  const openMenuEmploisPDF = useStore(state => state.openMenuEmploisPDF);
  const onHandleOpenMenuEmploisPDFnull = useStore(state => state.onHandleOpenMenuEmploisPDFnull);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setAnchorEl(openMenuEmploisPDF);
    return () => {
      setAnchorEl(null);
    };
  }, [openMenuEmploisPDF]);

  const handleClose = () => {
    setAnchorEl(null);
    onHandleOpenMenuEmploisPDFnull();
  };

  const options = [
    {
      id: 1,
      label: (
        <span style={{ textDecoration: "none" }}>
          <div style={{ fontSize: "16px", color: "rgb(0, 167, 111)", width: "100%", display: "flex", alignItems: "center" }}>
            <MdPrint style={{ fontSize: "18px", marginRight: "7px" }} /> Autoriser Impression
          </div>
        </span>
      )
    },
    {
      id: 2,
      label: (
        <div onClick={() => toglleCurrentElementToDownload('TF')} style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
          <MdPerson style={{ color: "rgb(0, 167, 111)", marginRight: "7px" }} /> Tous Formateurs
        </div>
      )
    },
    {
      id: 3,
      label: (
        <div onClick={() => toglleCurrentElementToDownload('TG')} style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
          <MdGroup style={{ color: "rgb(0, 167, 111)", marginRight: "7px" }} /> Tous Groupes
        </div>
      )
    },
    {
      id: 4,
      label: (
        <div onClick={() => toglleCurrentElementToDownload('TS')} style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
          <MdMeetingRoom style={{ color: "rgb(0, 167, 111)", marginRight: "7px" }} /> Toutes Salles
        </div>
      )
    }
  ];

  return (
    <section style={{ transition: "none" }} className="dashboard-layout">
      <Helmet>
      <title>Dashboard | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <CustomMenu />
      <Layout className="dashboard-inner-layout">
        <CustomHeader />
        <Content className="content">
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
                width: '26ch',
                padding: "10px",
                borderRadius: "10px",
                outline: "0px",
                backdropFilter: "blur(20px)",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                boxShadow: "rgba(145, 158, 171, 0.24) 0px 0px 7px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px",
                overflow: "inherit",
                marginTop: "-6px",
              },
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.id} selected={option === 'Pyxis'} onClick={handleClose}>
                {option.label}
              </MenuItem>
            ))}
          </Menu>
          <Outlet />
        </Content>
      </Layout>
    </section>
  );
};

export default Dashboard;
