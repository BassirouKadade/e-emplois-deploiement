import React, { useEffect, useState } from 'react';
import '../../../styles/formateur/detail.css'
import { useParams, Link } from 'react-router-dom';
import { message, Popconfirm, Empty, Alert, Space } from 'antd';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { GiBookmark } from 'react-icons/gi';
import { FaCirclePlus } from 'react-icons/fa6';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { CiSearch } from 'react-icons/ci';
import { Helmet } from 'react-helmet';
import { deleteEtablissementUser } from '../../../request/userRequest/userRequest';
import { ajouterRoleUser } from '../../../request/userRequest/userRequest';
import { AiOutlineReload } from 'react-icons/ai';
import LinearProgress from '@mui/material/LinearProgress';
import { ajouterModuleFormateur, deleteModuleFormateur} from '../../../request/moduleRequest/moduleRequest';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { deleteRoleUser } from '../../../request/userRequest/userRequest';
import Progress from '../../../components/Progess';
import { getEtablissemntUser } from '../../../request/userRequest/userRequest';
import { getInfoUser } from '../../../request/userRequest/userRequest';
import {  ajouterMGroupeFormateur,deleteGroupeFormateur,getGroupesNonInclusFormateur} from '../../../request/formateurRequest/formateurRequest';
import getRoleUsers  from '../../../request/userRequest/userRequest';
import { listeRoles } from '../../../request/userRequest/userRequest';
export default function EtablissementDirecteur() {
 
  // Extraction de l'ID des paramètres d'URL
  const { id } = useParams();
  
  // Initialisation du client de requête
  const queryClient = useQueryClient();
  
  // Déclaration des états locaux
  const [modulesFormateur, setModulesFormateur] = useState([]);
  const [groupesFormateur, setGroupesFormateur] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDeleteGroupeFormateur, setOpenDeleteGroupeFormateur] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmLoadingSupprimerGroupeFormateur, setConfirmLoadingSupprimerGroupeFormateur] = useState(false);
  const [modules, setModules] = useState([]);
  const [modulesFilter, setModulesFilter] = useState(modules);
  const [formDataSearch, setFormDataSearch] = useState("");
  const [loadingDataSearch, setLoadingDataSearch] = useState(false);
  const [currentFormateur, setCurrentFormateur] = useState({});
  const [errorServer, setErrorServer] = useState({});
  const [idModuleSupprimer, setIdModuleSupprimer] = useState(null);
  const [idGroupeSupprimer, setIdGroupeSupprimer] = useState(null);
  const [moduleEnCours, setModuleEnCours] = useState(null);
  
  // Récupération des informations du formateur
  const { data: getInfoFormateur, isLoading: isLoadingGetFormateur } = useQuery(['get-info-user', id], async () => {
      try {
          const response = await getInfoUser(id);
          return response.data;
      } catch (error) {
          console.error(error);
          setErrorServer(error.response.data);
          throw error;
      }
  });
  
  useEffect(() => {
      if (!isLoadingGetFormateur) {
          setCurrentFormateur(getInfoFormateur);
      }
  }, [getInfoFormateur, isLoadingGetFormateur]);
  
  // Récupération de tous les modules
  const { data: tousModulesData, isLoading: isLoadingTousModuleData } = useQuery(['all-roles',id], async () => {
      try {
          const response = await listeRoles(id);
          return response.data;
      } catch (error) {
          console.error(error);
          throw error;
      }
  },{
    onSuccess:()=>{
      queryClient.invalidateQueries('get-roles-users');
    }
  });
  
  useEffect(() => {
      if (!isLoadingTousModuleData) {
          setModules(tousModulesData);
          setModulesFilter(tousModulesData);
      }
  }, [tousModulesData, isLoadingTousModuleData]);
  
  const { data: moduleFormateur, isLoading: isLoadingModuleFormateur } = useQuery(['get-atablissement-formateur', id], async () => {
      try {
          const response = await getEtablissemntUser(id);
          return response.data;
      } catch (error) {
          console.error(error);
          throw error;
      }
  });
  
  useEffect(() => {
      if (!isLoadingModuleFormateur) {
          setModulesFormateur(moduleFormateur);
      }
  }, [moduleFormateur, isLoadingModuleFormateur]);
  
  // Récupération des groupes affectés au formateur
  const { data: GroupeFormateur, isLoading: isLoadingGroupeFormateur } = useQuery(['get-roles-users', id], async () => {
      try {
          const response = await getRoleUsers(id);
          return response.data;
      } catch (error) {
          console.error(error);
          throw error;
      }
},{
    enabled:!!id
});
  
  useEffect(() => {
      if (!isLoadingGroupeFormateur) {
          setGroupesFormateur(GroupeFormateur);
      }
  }, [GroupeFormateur, isLoadingGroupeFormateur]);
  
  // Mutation pour supprimer un module affecté au formateur
  const { mutate: supprimerModuleFormateur } = useMutation(
      async (data) => {
          try {
              await deleteEtablissementUser(data);
          } catch (error) {
              console.error("Erreur lors de la suppression du module pour le formateur:", error);
              throw new Error("Échec de la suppression du module pour le formateur.");
          }
      },
      {
          onSuccess: () => {
            queryClient.invalidateQueries((queryKey) => {
              return new RegExp(`^get-etablissement-formateur-${id}`).test(queryKey);
            });  
        },
      }
  );
  
  // Gestion de la suppression d'un module
  const handleOk = async () => {
      setConfirmLoading(true);
      try {
          await supprimerModuleFormateur( idModuleSupprimer);
          setOpenDelete(false);
          message.success('Le module a été supprimé avec succès', 2);
      } catch (error) {
          console.error("Une erreur s'est produite lors de la suppression du module:", error);
          message.error("Une erreur s'est produite lors de la suppression du module", 2);
      } finally {
          setConfirmLoading(false);
      }
  };
  
  const handleCancel = () => {
      message.error('La suppression a été annulée', 2);
      setOpenDelete(false);
  };
  
  // Mutation pour supprimer un groupe affecté au formateur
  const { mutate: supprimerGroupeFormateur } = useMutation(
    async (data) => {
      try {
        await deleteRoleUser(data);
      } catch (error) {
        console.error("Erreur lors de la suppression du groupe pour le formateur:", error);
        throw new Error("Échec de la suppression du groupe pour le formateur.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('get-roles-users');
              queryClient.invalidateQueries('all-roles');  
      },
    }
  );
  
  // Gestion de la suppression d'un groupe
  const handleOkSupprimerGroupeFormateur = async () => {
      setConfirmLoadingSupprimerGroupeFormateur(true);
      try {
          await supprimerGroupeFormateur({ idRole: idGroupeSupprimer, idUser: id });
          setOpenDeleteGroupeFormateur(false);
          message.success('Le groupe a été supprimé avec succès', 2);
      } catch (error) {
          console.error("Une erreur s'est produite lors de la suppression du groupe:", error);
          message.error("Une erreur s'est produite lors de la suppression du groupe", 2);
      } finally {
          setConfirmLoadingSupprimerGroupeFormateur(false);
      }
  };
  
  const handleCancelSupprimerGroupeFormateur = () => {
      message.error('La suppression a été annulée', 2);
      setOpenDeleteGroupeFormateur(false);
  };
  
  // Gestion de la recherche de modules
  const handleSearch = () => {
      setLoadingDataSearch(true);
      setTimeout(() => {
          setLoadingDataSearch(false);
          setModulesFilter(
              modules.filter(module =>
                  module.name.toLowerCase().includes(formDataSearch.toLowerCase())
              )
          );
      }, 1000);
  };
  
  const actualiserListeModule = () => {
      setModulesFilter(modules);
  };
  
  // Breadcrumbs pour la navigation
  const breadcrumbs = [
      <Link style={{ fontSize: "15px", textDecoration: "none", color: "rgb(99, 115, 119,0.7)" }} key="1" to="/dashboard">
          Dashboard
      </Link>,
      <Link style={{ fontSize: "15px", textDecoration: "none", color: "rgb(99, 115, 119,0.7)" }} key="2" to="/dashboard/directeur/directeur-liste">
          directeur
      </Link>,
      <Link style={{ fontSize: "15px", textDecoration: "none", color: "rgb(99, 115, 119,0.7)" }} key="3">
          {isLoadingGetFormateur ? <Skeleton baseColor='#f7f7f7' highlightColor='#ebebeb' style={{ margin: "5px 0", width: "auto", minWidth: "230px", height: "26px" }} /> : <span style={{ textTransform: "capitalize" }}> {currentFormateur.nom} {currentFormateur.prenom}</span>}
      </Link>
  ];
  
  // Mutation pour ajouter un module au formateur
  const { mutate: ajouterRole, isLoading: isAddingModule } = useMutation(
    async (data) => {
      try {
        await ajouterRoleUser(data);
      } catch (error) {
        console.error("Erreur lors de l'ajout du rôle pour l'utilisateur:", error);
        throw new Error("Échec de l'ajout du rôle pour l'utilisateur.");
      }
    },
    {
      onSuccess: () => {
        // alert('poiuy')
        queryClient.invalidateQueries('get-roles-users');
        queryClient.invalidateQueries('all-roles');  

      },

    }
  );
  

  if (errorServer?.errorNotExiste) {
      return (
          <Space direction="vertical" style={{ width: '100%' }}>
              <Alert message="Tentative de Violation du Site" description="Votre action a été bloquée car elle constitue une violation de nos règles." type="error" showIcon />
          </Space>
      );
  }
  
    return (
        <section className='detail-container'>
               <Helmet>
      <title>Détail-Directeur | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
            <article className="breadcrumbs">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    {breadcrumbs}
                </Breadcrumbs>
            </article>
            
            <article  className="container-profile">
                <div style={{width:"400px"}} className="nav-left-profile">
                    <article className="about-formateur-detail-ul">
                        <ul className='list-module-formateur-detail-ul'>
                        <h5 className='addDataGroupeModuleH5'>
                                    <span>Etablissements</span>
                                    </h5>
                            {isLoadingModuleFormateur ? (
                                <div style={{ padding: 0 }} className='container'>
                                    {[1, 2, 3, 4, ].map((_, index) => (
                                        <Skeleton baseColor='#f7f7f7' highlightColor='#ebebeb' style={{ margin: "5px 0", width: "100%", height: "31px" }} key={index} />
                                    ))}
                                </div>
                            ) : modulesFormateur.length === 0 ? (
                                <div className="empty-container" style={{top:"60%"}}>
                                    <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" imageStyle={{ height: 60, marginTop: "-110px" }} description={<span>Aucun module trouvé</span>} />
                                </div>
                            ) : (
                                <>
                                   
                                    {modulesFormateur?.map((module, index) => (
                                        <li key={index}>
                                            <span>
                                                <GiBookmark className='icons-modules' />
                                                {module.nom}
                                            </span>
                                            <span>
                                                <IconButton aria-label="delete" onClick={() => { setIdModuleSupprimer(module.id); setOpenDelete(true); }}>
                                                    <DeleteIcon style={{ fontSize: "17px", color: "red" }} />
                                                </IconButton>
                                            </span>
                                        </li>
                                    ))}
                                </>
                            )}
                            <Popconfirm
                                title="Suppression"
                                description="Êtes-vous sûr de vouloir supprimer l'etablissement ?"
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
                        </ul>
                  </article>
                  <article style={{marginTop:"10px"}} className="about-formateur-detail-ul">
                        <ul className='list-module-formateur-detail-ul'>
                        <h5 className='addDataGroupeModuleH5'>
                                        <span>Roles</span>
                                      
                                    </h5>
                            {isLoadingGroupeFormateur ? (
                                <div style={{ padding: 0 }} className='container'>
                                    {[1, 2, 3, 4, 5].map((_, index) => (
                                        <Skeleton baseColor='#f7f7f7' highlightColor='#ebebeb' style={{ margin: "5px 0", width: "100%", height: "29px" }} key={index} />
                                    ))}
                                </div>
                            ) : groupesFormateur.length === 0 ? (
                                <div className="empty-container" style={{top:"60%"}}> 
                                    <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" imageStyle={{ height: 60, marginTop: "-110px" }} description={<span>Aucun module trouvé</span>} />
                                </div>
                            ) : (
                                <>
                    
                                    {groupesFormateur?.map((groupe, index) => (
                                        <li key={index}>
                                            <span>
                                                <GiBookmark className='icons-modules' />
                                                {groupe.name}
                                            </span>
                                            <span>
                                                <IconButton aria-label="delete" onClick={() => { setIdGroupeSupprimer(groupe.id); setOpenDeleteGroupeFormateur(true); }}>
                                                    <DeleteIcon style={{ fontSize: "17px", color: "red" }} />
                                                </IconButton>
                                            </span>
                                        </li>
                                    ))}
                                </>
                            )}
                            <Popconfirm
                                title="Suppression"
                                description="Êtes-vous sûr de vouloir supprimer le role ?"
                                open={openDeleteGroupeFormateur}
                                placement='top'
                                onConfirm={handleOkSupprimerGroupeFormateur}
                                cancelText="Non"
                                okText="Oui"
                                okButtonProps={{
                                    loading: confirmLoadingSupprimerGroupeFormateur,
                                    style: { backgroundColor: 'red', borderColor: 'red' }
                                }}
                                onCancel={handleCancelSupprimerGroupeFormateur}
                            />
                        </ul>
                    </article>
                </div>
            {/* ****************************** */}
                <div  className="nav-right-profile">
                    <div className="chargement chargement-module">
                        <div style={{ width: "100%" }} className='filter-item-one'>
                            <CiSearch className='filter-search' />
                            <input
                                onChange={e => setFormDataSearch(e.target.value)}
                                value={formDataSearch}
                                onKeyUp={e => { if (e.key === 'Enter') handleSearch() }}
                                className='filter-input'
                                type="text"
                                style={{ fontSize: "15px" }}
                                placeholder='Rechercher un role ...'
                            />
                            <AiOutlineReload onClick={actualiserListeModule} className="filter-button" />
                        </div>
                        {loadingDataSearch && <LinearProgress style={{ height: "0.14rem", borderRadius: "10px", width: "97%" }} color="success" />}
                    </div>
                    <ul className='moduldisponible'>
                        {isLoadingTousModuleData ? (
                            <div style={{ padding: 0 }} className='container'>
                                {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                                    <Skeleton baseColor='#f7f7f7' highlightColor='#ebebeb' style={{ margin: "5px 0", width: "100%", height: "45px" }} key={index} />
                                ))}
                            </div>
                        ) : modulesFilter?.length === 0 ? (
                            <div className="empty-container">
                                <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" imageStyle={{ height: 60, marginTop: "-160px" }} description={<span>Aucun résultat trouvé</span>} />
                            </div>
                        ) : (
                            modulesFilter?.map((module, index) => (
                                <li onMouseOver={()=>setModuleEnCours(module.id)} key={index}>
                                     {module?.name}
                                    {isAddingModule && module.id === moduleEnCours ? (
                                        <span style={{ height: "34px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", left: "-8px" }}>
                                            <Progress w={"18px"} h={"18px"} color={'rgb(0, 167, 111)'} />
                                        </span>
                                    ) : (
                                        <IconButton onClick={async() => await ajouterRole({ idRole: module.id, idUser: id })} aria-label="add">
                                            <FaCirclePlus style={{ fontSize: "18px" }} color='rgb(0, 167, 111)' />
                                        </IconButton>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </article>
        </section>
    );
}