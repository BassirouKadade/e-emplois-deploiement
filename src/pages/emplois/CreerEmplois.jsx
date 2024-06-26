import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Alert } from 'antd';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../styles/emplois/CreerEmplois.css';
import { getModulesGroupe } from '../../request/moduleRequest/moduleRequest';
import { getInfoGroupesTotatles } from '../../request/groupeRequest/groupeRequest';
import { getEmploisGroupe } from '../../request/createEmploisRequest/createEmploisRequest';
import DialogContext from '../../components/DialogContext';
import SallesVerification from './SallesVerification';
import HeaderSection from './tableEmplois/HeaderSection';
import DataSearch from './DataSearch/DataSearch';
import InterfaceEmplois from './tableEmplois/InterfaceEmplois';
import ModulesVerification from './ModulesVerification';
import { Helmet } from 'react-helmet';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getInfoEtablissement } from '../../request/createEmploisRequest/createEmploisRequest';
export default function CreerEmplois() {
  // State management
  const [currentGroupeEmplois, setCurrentGroupeEmplois] = useState(null);
  const [formDataSearch, setFormDataSearch] = useState("");
  const [loadingDataSearch, setLoadingDataSearch] = useState(false);
  const [groupesFilter, setGroupesFilter] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [errorServer, setErrorServer] = useState({});
  const [openSalle, setOpenSalle] = useState(false);
  const [openModule, setOpenModule] = useState(false);
  const [emploisData, setEmploisData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [openBac, setOpenBac] = useState(false);
  const [dataEmploisSalle, setDataSemploisSalle] = useState({
    data: [],
    loading: null,
    selectedSalle: false
  });
  const [dataEmploisFormateur, setDataEmploisFormateur] = useState({
    data: [],
    loading: null,
    selectedFormateur: false
  });

  // Fetch group info
  const { data: getInfoGroupes, isLoading: isLoadingGetGroupes } = useQuery(
    ['liste-groupes-centre'],
    async () => {
      try {
        const response = await getInfoGroupesTotatles();
        return response.data;
      } catch (error) {
        console.error(error);
        setErrorServer(error.response.data);
        throw error;
      }
    }
  );

  useEffect(() => {
    if (!isLoadingGetGroupes) {
      setGroupes(getInfoGroupes);
      setGroupesFilter(getInfoGroupes);
    }
  }, [getInfoGroupes, isLoadingGetGroupes]);


  // Fetch module info for selected group
  const { data: getModuleFiliereGroupe, isLoading: isLoadingModuleFiliereGroupes } = useQuery(
    ['get-Module-Filiere-groupe', currentGroupeEmplois?.id],
    async () => {
      if (!currentGroupeEmplois?.id) {
        throw new Error("L'ID du groupe n'est pas disponible");
      }
      try {
        const response = await getModulesGroupe(currentGroupeEmplois.id);
        return response.data;
      } catch (error) {
        console.error(error);
        setErrorServer(error.response?.data || "Une erreur est survenue lors de la récupération des données");
        throw error;
      }
    },
    {
      enabled: !!currentGroupeEmplois?.id
    }
  );


  // Fetch schedule info for selected group


  const { data: getEmplois, isLoading: loadingGetEmplois } = useQuery(
    ['get-emplois-groupe', currentGroupeEmplois?.id],
    async () => {
      if (!currentGroupeEmplois?.id) {
        throw new Error("L'ID du groupe n'est pas disponible");
      }
      try {
        const response = await getEmploisGroupe(currentGroupeEmplois.id);
        return response.data;
      } catch (error) {
        console.error(error);
        setErrorServer(error.response?.data || "Une erreur est survenue lors de la récupération des données");
        throw error;
      }
    },
    {
      enabled: !!currentGroupeEmplois?.id
    }
  );
 

  useEffect(() => {
    if (!loadingGetEmplois && getEmplois) {
      setEmploisData(getEmplois);
    }
  }, [loadingGetEmplois, getEmplois]);

  // Handle search
  const handleSearch = () => {
    setLoadingDataSearch(true);
    setTimeout(() => {
      setLoadingDataSearch(false);
      setGroupesFilter(
        groupes.filter(groupe =>
          groupe.code.toLowerCase().includes(formDataSearch.toLowerCase())
        )
      );
    }, 1000);
  };

  const refreshModuleList = () => {
    setGroupesFilter(groupes);
  };

  // Set current date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR');
    setCurrentDate(formattedDate);
  }, []);

  // Handle open and close dialog
  const handleClickOpenSalle = () => {
    setOpenSalle(true);
  };

  const handleClickCloseSalle = () => {
    setOpenSalle(false);
  };

  const handleClickOpenModule = () => {
    setOpenModule(true);
  };

  const handleClickCloseModule = () => {
    setOpenModule(false);
  };

  // Manage data loading states
  useEffect(() => {
    if (dataEmploisSalle.loading || dataEmploisFormateur.loading) {
      setOpenBac(true);
    } else {
      setOpenBac(false);
    }
  }, [dataEmploisSalle.loading, dataEmploisFormateur.loading]);


  getInfoEtablissement

  
// *************************
// getInfoEtablissement
// ***********
  const { data: getInfoEtablissementDirecteur, isLoading: isLoadingGetInfoEtablissementDirecteur } = useQuery(
    ['get-ifo-etablissememen-directeur'],
    async () => {
      try {
        const response = await getInfoEtablissement();
        return response.data;
      } catch (error) {
        console.error(error);
        setErrorServer(error.response?.data || "Une erreur est survenue lors de la récupération des données");
        throw error;
      }
    }
  );
  return (
    <div className='div-creation-emplois'>
      <Helmet>
        <title>Create-emplois | E-Emplois</title>
        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <DialogContext setOpen={setOpenSalle} open={openSalle}>
        <SallesVerification
          setDataEmploisFormateur={setDataEmploisFormateur}
          handleClickCloseSalle={handleClickCloseSalle}
          setDataSemploisSalle={setDataSemploisSalle}
        />
      </DialogContext>

      <DialogContext setOpen={setOpenModule} open={openModule}>
        <ModulesVerification data={{ getModuleFiliereGroupe, isLoadingModuleFiliereGroupes }} />
      </DialogContext>

      <div className='div-emplois-headers'>
        {/* <img style={{ borderRadius: "50%" }} width={65} height={65} src={LogEmplois} alt="" /> */}
        <div>
          {
            dataEmploisSalle.selectedSalle && !dataEmploisSalle.loading ? (
              <Alert
                message="La consultation de l'emploi du temps de la salle a été effectuée avec succès."
                type="success"
                showIcon
                closable
              />
            ) : (
              dataEmploisFormateur.selectedFormateur && !dataEmploisFormateur.loading ? (
                <Alert
                  message="La consultation de l'emploi du temps de formateur a été effectuée avec succès."
                  type="success"
                  showIcon
                  closable
                />
              ) : (
                isLoadingGetInfoEtablissementDirecteur && !getInfoEtablissementDirecteur?
                <Skeleton
                baseColor='#f7f7f7'
                highlightColor='#ebebeb'
                style={{ margin: "5px 0", width: "260px", height: "35px" }}
              />:
                <span className='dateStyle'>{getInfoEtablissementDirecteur?.nom} </span>
              )
            )
          }
        </div>
        <div className='heureDiv'>
        {currentDate}
        </div>
      </div>

      <div className="div-emplois-body">
        <DataSearch
          data={{
            setFormDataSearch,
            refreshModuleList,
            loadingDataSearch,
            setDataEmploisFormateur,
            isLoadingGetGroupes,
            groupesFilter,
            setDataSemploisSalle,
            handleSearch,
            formDataSearch,
            setCurrentGroupeEmplois,
          }}
        />
        <div style={{ width: "74%" }}>
          <HeaderSection
            data={{
              currentGroupeEmplois,
              handleClickOpenSalle,
              handleClickOpenModule,
            }}
          />
          <InterfaceEmplois
            data={{
              openBac,
              dataEmploisFormateur,
              setDataEmploisFormateur,
              setDataSemploisSalle,
              setEmploisData,
              dataEmploisSalle,
              emploisData,
              currentGroupeEmplois,
            }}
          />
        </div>
      </div>
    </div>
  );
}
