import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { message, Popconfirm } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { GiBookmark } from 'react-icons/gi';
import { FaCirclePlus } from 'react-icons/fa6';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { CiSearch } from 'react-icons/ci'; // Make sure to install react-icons
import { AiOutlineReload } from 'react-icons/ai'; // Make sure to install react-icons
import LinearProgress from '@mui/material/LinearProgress';
import { listeTousModuleNonPagineGroupe } from '../../../request/groupeRequest/groupeRequest';
import { modulesGroupeDisponible } from '../../../request/groupeRequest/groupeRequest';
import { getInfoGroupe } from '../../../request/groupeRequest/groupeRequest';
import { ajouterModuleGroupe } from '../../../request/groupeRequest/groupeRequest';
import { deleteModuleGroupe } from '../../../request/groupeRequest/groupeRequest';
import { useQuery ,useQueryClient, useMutation} from 'react-query';
import { Avatar, Box, keyframes } from '@chakra-ui/react';
import {  Empty } from 'antd';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Progress from '../../../components/Progess';
import '../../../styles/filiere/detailFiliere.css'
import { Helmet } from 'react-helmet';
import { Alert, Space } from 'antd';
import Logo from '../../../assets/laurent.svg'
export default function DetailGroupe() {
    const size = '76px';
    const color = 'teal';

    const pulseRing = keyframes`
        0% {
            transform: scale(0.33);
        }
        40%,
        50% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    `;
    const queryClient=useQueryClient() 
    const { id } = useParams();
  const [modulesGroupe,setModulesGroupe]=useState([])
    const [openDelete, setOpenDelete] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modules, setModules] = useState([]);
    const [modulesFilter, setModulesFilter] = useState(modules);
    const [formDataSearch, setFormDataSearch] = useState("");
    const [loadingDataSearch, setLoadingDataSearch] = useState(false);
    const [currentFormateur,setCurrentFormateur]=useState({})
  const [errorServer,setErrorServer]=useState({})
    
  
  const { data: getInfoFormateur, isLoading: isLoadingGetFormateur } = useQuery(['get-infofiliere',id], async () => {
        try {
            const response = await getInfoGroupe(id);
            return response.data;
        } catch (error) {
            console.error(error);
            setErrorServer(error.response.data)
            throw error;
        }
    });


    useEffect(() => {
        if (!isLoadingGetFormateur) {
            setCurrentFormateur(getInfoFormateur);
        }
    }, [getInfoFormateur, isLoadingGetFormateur]);

  
    const { data: tousModulesData, isLoading: isLoadingTousModuleData } = useQuery(['all-module-groupe-not-existe',id], async () => {
        try {
            const response = await listeTousModuleNonPagineGroupe(id);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    });
    useEffect(() => {
        if (!isLoadingTousModuleData) {
            setModules(tousModulesData);
            setModulesFilter(tousModulesData);
        }
    }, [tousModulesData, isLoadingTousModuleData]);

    const { data: moduleFormateur, isLoading: isLoadingModuleFormateur } = useQuery(['module-filiere-existe',id], async () => {
        try {
            const response = await modulesGroupeDisponible(id);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    });

      useEffect(() => {
        if (!isLoadingModuleFormateur) {
            setModulesGroupe(moduleFormateur);
        }
    }, [moduleFormateur, isLoadingModuleFormateur]);

  
    const showPopconfirm = () => {
        setOpenDelete(true);
    };

     const [idModuleSupprimer,setIdModuleSupprimer]=useState(null);

    const { mutate:supprimerModuelFiliere } = useMutation(
        async (data) => {
          try {
            await deleteModuleGroupe(data);
          } catch (error) {
            console.error("Erreur lors de l'ajout du module pour le formateur:", error);
            throw new Error("Échec de l'ajout du module pour le formateur.");
          }
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries('module-filiere-existe');
            queryClient.invalidateQueries('all-module-groupe-not-existe');
          },
        }
      );
    
    const handleOk = async () => {
        setConfirmLoading(true);
        try {
            setConfirmLoading(true);
            // alert(JSON.stringify({ idModule:idModuleSupprimer, idFiliere:id }))
            await supprimerModuelFiliere({ idModule:idModuleSupprimer, idGroupe:id });
            setOpenDelete(false);
            message.success('La filière a été supprimée avec succès', 2);
        } catch (error) {
            console.error("Une erreur s'est produite lors de la suppression du formateur:", error);
            message.error("Une erreur s'est produite lors de la suppression du formateur", 2);
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        message.error('La suppression a été annulée', 2);
        setOpenDelete(false);
    };

    const handleSearch = () => {
        setLoadingDataSearch(true);
        setTimeout(() => {
            setLoadingDataSearch(false);
            setModulesFilter(
                modules.filter(module =>
                    module.description.toLowerCase().includes(formDataSearch.toLowerCase())
                )
            );
        }, 1000);
    };

    function actualiserListeModule(){
        setModulesFilter(modules)
    }
    const breadcrumbs = [
        <Link style={{ fontSize: "15px", textDecoration: "none", color: "rgb(99, 115, 119,0.7)" }} key="1" to="/dashboard">
            Dashboard
        </Link>,
        <Link style={{ fontSize: "15px", textDecoration: "none", color: "rgb(99, 115, 119,0.7)" }} key="2" to="/dashboard/groupe/liste-groupe">
          Groupe
        </Link>,
        <Typography style={{ fontSize: "15px" }} key="3" color="text.primary">
            {currentFormateur.code}
        </Typography>,
    ];


const { mutate, isLoading: isAddingModule } = useMutation(
    async (data) => {
      try {
        await ajouterModuleGroupe(data);
      } catch (error) {
        console.error("Erreur lors de l'ajout du module pour le formateur:", error);
        throw new Error("Échec de l'ajout du module pour le formateur.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('all-module-groupe-not-existe');
        queryClient.invalidateQueries('module-filiere-existe');
      },
    }
  );

  const [moduleEncours,setModuleEncours]=useState(null)
  
  // Fonction pour ajouter un module pour un formateur
  function ajouterModule(idModule) {
    setModuleEncours(idModule)
    mutate({ idModule, idGroupe:id });
  }
  
//   if(errorServer?.errorNotExiste){ 
//       return <Space
//       direction="vertical"
//       style={{
//         width: '100%',
//       }}
//     >
//      <Alert
//   message="Tentative de Violation du Site"
//   description="Votre action a été bloquée car elle constitue une violation de nos règles."
//   type="error"
//   showIcon
// />

//     </Space>
//   }
    return (
        <section className='detail-container'>
             <Helmet>
      <title>Détail-Groupe | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
            <article className="breadcrumbs">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    {breadcrumbs}
                </Breadcrumbs>
            </article>

            <article className="container-profile">
                <div className="nav-left-profile">
                    <article style={{height:"40%"}}  className="nombre-module">
                        <Box
                            as="div"
                            position="relative"
                            w={size}
                            h={size}
                            _before={{
                                content: "''",
                                position: 'relative',
                                display: 'block',
                                width: '300%',
                                height: '300%',
                                boxSizing: 'border-box',
                                marginLeft: '-100%',
                                marginTop: '-100%',
                                borderRadius: '50%',
                                bgColor: color,
                                animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
                            }}>
                            <Avatar
                                src={Logo}
                                size="full"
                                position="absolute"
                                top={0}
                                left={0}
                                borderRadius={"50%"}
                            />
                        </Box>
                        <div style={{height:"30%"}}  className='info-teacher'>
                           {isLoadingGetFormateur?  <Skeleton
          baseColor='#f7f7f7'
          highlightColor='#ebebeb'
          style={{ margin: "5px 0",width:"auto", minWidth: "230px", height: "26px" }}
        />: <span style={{textTransform:"capitalize",fontSize:"21px"}}> {currentFormateur.code} </span>}

{isLoadingGetFormateur?  <Skeleton
          baseColor='#f7f7f7'
          highlightColor='#ebebeb'
          style={{ margin: "5px 0", width:"auto", minWidth: "160px", height: "23px" }}
        />:  <span style={{fontSize:"14px", textTransform:"capitalize"}}>{currentFormateur.description}</span>}

                     
                        </div>
                    </article>
                    <article style={{height:"60%"}} className="about-formateur">
                    <ul className='list-module-formateur'>
                    <Popconfirm
    title="Suppression"
    description="Êtes-vous sûr de vouloir supprimer le module ?"
    open={openDelete}
    placement='top'
    onConfirm={handleOk}
    cancelText="Non"
    okText="Oui"
    okButtonProps={{
      loading: confirmLoading,
      style: { backgroundColor: 'red', borderColor: 'red' }
    }}
    onCancel={handleCancel}
  />
  {isLoadingModuleFormateur ? (
    <div style={{ padding: 0 }} className='container'>
      {/* Affichage des indicateurs de chargement */}
      {[1, 2, 3, 4, 5,6,78].map((_, index) => (
        <Skeleton
          baseColor='#f7f7f7'
          highlightColor='#ebebeb'
          style={{ margin: "5px 0", width: "100%", height: "29px" }}
          key={index}
        />
      ))}
    </div>
  ) : modulesGroupe.length === 0 ? (
    <div className="empty-container">
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
          marginTop: "-110px"
        }}
        description={<span>Aucun module trouvé</span>}
      />
    </div>
  ) : (
    <>
      <h5>Modules de Groupe</h5>
      {modulesGroupe.map((module, index) => (
        <li key={index}>
          <span>
            <GiBookmark className='icons-modules' />
            {module.description}
          </span>
          <span>
            <IconButton aria-label="delete" onClick={() => { setIdModuleSupprimer(module.id); showPopconfirm(); }}>
              <DeleteIcon style={{ fontSize: "17px", color: "red" }} />
            </IconButton>
          </span>
        </li>
      ))}
    </>
  )}
 
</ul>


                    </article>
                </div>
                <div className="nav-right-profile">
                    <div className="chargement chargement-module">
                        <div style={{ width: "100%" }} className='filter-item-one'>
                            <CiSearch className='filter-search' />
                            <input
                                onChange={e => setFormDataSearch(e.target.value)}
                                value={formDataSearch}
                                onKeyUp={e => { if (e.key === 'Enter') handleSearch() }}
                                className='filter-input'
                                type="text"
                                style={{fontSize:"15px"}}
                                placeholder='Rechercher un module ...'
                            />
                           
                           <AiOutlineReload onClick={actualiserListeModule} className="filter-button" />
                        </div>
                        {loadingDataSearch && <LinearProgress style={{ height: "0.14rem", borderRadius: "10px", width: "97%" }} color="success" />}
                    </div>
                    <ul className='moduldisponible'>
  {isLoadingTousModuleData ? (
    <div style={{ padding: 0 }} className='container'>
      {/* Affichage des indicateurs de chargement */}
      {[1,2,3,4,5,6,7].map((_, index) => (
        <Skeleton
          baseColor='#f7f7f7'
          highlightColor='#ebebeb'
          style={{ margin: "5px 0", width: "100%", height: "45px" }}
          key={index}
        />
      ))}
    </div>
  ) : modulesFilter.length === 0 ? (
    <div className="empty-container">
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
          marginTop:"-160px"
        }}
        description={<span>Aucun résultat trouvé</span>}
      />
    </div>
  ) : (
    modulesFilter.map((module, index) => (
      <li key={index}>
        {module.description}
        {
            isAddingModule && module.id===moduleEncours? <span style={{height:"34px",position:"relative", display:"flex",alignItems:"center",justifyContent:"center", left:"-8px"}}>
                 <Progress   w={"18px"} h={"18px"} color={'rgb(0, 167, 111)'} /> 
            </span>
        :
        <IconButton  onClick={()=>ajouterModule(module.id)} aria-label="add">
          <FaCirclePlus style={{ fontSize: "18px" }} color='rgb(0, 167, 111)' />
        </IconButton>
     }
      </li>
        
    ))
  )}
</ul>

                </div>
            </article>
        </section>

    );
}
