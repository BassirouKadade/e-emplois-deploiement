import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Breadcrumbs, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useQuery } from 'react-query';
import { getTotalMasseHoraireGroupe } from '../../../request/createEmploisRequest/createEmploisRequest';
import Skeleton from 'react-loading-skeleton'; // Import du composant Skeleton pour l'affichage de chargement
import 'react-loading-skeleton/dist/skeleton.css';

export default function HeaderSection({ data }) {
  const { currentGroupeEmplois,handleClickOpenModule, handleClickOpenSalle } = data;
  const [errorServer, setErrorServer] = useState({});

  const { data: totalHeuresData, isLoading } = useQuery(
    ['get-totale-seance-groupe', currentGroupeEmplois?.id],
    async () => {
      try {
        const response = await getTotalMasseHoraireGroupe(currentGroupeEmplois?.id);
        return response.data;
      } catch (error) {
        setErrorServer(error.response?.data || 'Une erreur est survenue');
        throw error;
      }
    },
    {
      enabled: !!currentGroupeEmplois?.id,
    }
  );

  const breadcrumbs = [
    <Link
      key="1"
      to="/dashboard"
      style={{ fontSize: '15px', textDecoration: 'none', color: 'rgba(99, 115, 119, 0.7)' }}
    >
      Dashboard
    </Link>,
    <Typography key="2" style={{ fontSize: '15px' }} color="text.primary">
      Création d'emplois du temps
    </Typography>,
    currentGroupeEmplois?.id && (
      <Typography key="3" style={{ fontSize: '15px' }} color="text.primary">
        {currentGroupeEmplois.code}
      </Typography>
    ),
    currentGroupeEmplois?.id && (
      <Typography key="4" style={{ fontSize: '15px' }} color="text.primary">
         {isLoading ? 
         <Skeleton
         baseColor='#f7f7f7'
         highlightColor='#ebebeb'
         style={{  width: "100px", height: "28px" }}
       />
        : "TMH "+ totalHeuresData?.totalHeures+"h"} 
      </Typography>
    ),
  ];

 

  return (
    <div style={{padding:0, width:'97%'}} className="titreAlert">
      <span>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </span>
      <div className="publication-emplois">
        <Button
          style={{ background: 'rgba(148, 0, 211, 0.699)', color: '#ffffff' }}
          onClick={handleClickOpenSalle}
          className="btn btn-primary"
        >
          Salles
        </Button>
        <Button
          style={{ background: 'green', margin:'0',marginLeft:'10px', color: '#ffffff' }}
          className="btn btn-primary"
          onClick={handleClickOpenModule}
          disabled={!currentGroupeEmplois?.id}
        >
          Modules
        </Button>
        {/* <Button
          style={{ background: 'blue', color: '#ffffff' }}
          className="btn btn-primary"
        >
          Publier
        </Button> */}
      </div>
    </div>
  );
}
