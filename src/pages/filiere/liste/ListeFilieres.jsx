import  { useEffect, useState } from 'react';
import { AiOutlineReload } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import FiliereMod from './FiliereMod';
import Checkbox from '@mui/material/Checkbox';
import DialogContext from '../../../components/DialogContext';
import '../../../styles/indexListe.css'
import Button from '@mui/material/Button';
import { Popconfirm } from 'antd';
import { FaPlus } from "react-icons/fa6";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { message } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { FaArrowUp } from "react-icons/fa6";
import LinearProgress from '@mui/material/LinearProgress';
import {listeFiliere,searchFiliereNext, supprimerFiliere } from '../../../request/filiereRequest/filiereRequest';
import { Helmet } from 'react-helmet';
import {  Empty } from 'antd';
import { MdAssignment, MdEdit,  } from 'react-icons/md';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Drawer } from 'antd';
import NouvelleFiliere from '../ajout/NouvelleFiliere';
/*
   4 ----  Porbeleme de detaill
   5 ----  Ajout des modules users
   6 ----  xprter en PDF la liste des users
   7 ---- Afficher le message pour le suer lors de deamarde pour Entrer au niveau de recheche
*/

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const ITEM_HEIGHT = 48;

/* 
****************************************
            A  NOTER   ------------------
Temps d'attente pour les opérations asynchrones
Merci de supprimer le temps d'attente en mode production 
   
   
   PROBLEME A RESOUDRE
   -- Apres un recherche vous serez obliger de changer les données de dl'inpt pout pouvoir vois le resulat,car les 
     la valeur precedente de l'inpu a ete deja inclu dans les clés de useQuery
   */

// Importation de la variable d'environnement VITE_TIME pour la gestion du délai

// Déclaration du composant ListeFormateurs

export default function ListeFilieres() {

  // Gestion du menu contextuel
  const [anchorEl, setAnchorEl] = useState(null); // Élément d'ancrage du menu
  const openMenu = Boolean(anchorEl); // Indicateur pour savoir si le menu est ouvert
  const handleClick = (event) => { // Gestion du clic pour ouvrir le menu
    setAnchorEl(event.currentTarget);
  };


  const handleCloseMenu = () => { // Gestion de la fermeture du menu
    setAnchorEl(null);
  };

  // État pour la boîte de dialogue de modification
  const [open, setOpen] = useState(false);

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);

  // État pour la pagination de la recherche
  const [currentPageRechercher, setCurrentPageRechercher] = useState(null);

  // État pour le nombre total de pages
  const [totalPages,setTotalePages]=useState({});

  // Récupération de la liste des formateurs paginée avec React Query
  const { data, isLoading } = useQuery(['liste-filiere',currentPage], async () => {
    try {
      const response = await listeFiliere(currentPage);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  // Fonction pour fermer la boîte de dialogue de modification
  const handleClose = () => {
    setOpen(false);
  };

  // Fonction pour ouvrir la boîte de dialogue de modification
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Fonction pour changer de page lors de la pagination
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  
  // État pour stocker les données globales
  const [dataGlobal, setDataGlobal] = useState(null);

  // Gestion de la sélection des formateurs à supprimer
  const [dataToDelete, setDataToDelete] = useState([]);
  const [deleteTrChecked, setDeleteTrChecked] = useState(false);

  // Fonction pour gérer la sélection de suppression
  function handleClickToDelete(event){
    setDeleteTrChecked(event.target.checked)
    if(event.target.checked && dataGlobal){
      setDataToDelete( dataGlobal.map(element => ({id:element.id ,delete: true})))
    }else{
      setDataToDelete( dataGlobal.map(element => ({id:element.id ,delete: false})))
    }
  }

  // Fonction pour changer l'état de suppression d'un formateur
  function onChangeInput(e, index) {
    if (dataToDelete.find((element) => element.id === index)) {
      setDataToDelete(prev => prev.map(element => (element.id === index ? {...element, delete: e.target.checked} : element)));
    } else {
      setDataToDelete(prev => ([...prev, {id: index, delete: e.target.checked}]));
    }
  }

   // Utilisation du React Query Client
   const queryClient = useQueryClient();

   // Mutation pour supprimer un formateur
   const { mutate } = useMutation(async (data) => {
     try {
       await supprimerFiliere(data);
     } catch (error) {
       console.error(error);
     }
   }, {
     onSuccess: () => {
       if(totalPages.datainit){
         queryClient.invalidateQueries(['liste-filiere', currentPage]);
      }
      if(totalPages.rechercher){
         queryClient.invalidateQueries(['filiere-search',currentPageRechercher]);
         setIsSearching(true)
      }
     }
   });
 
   // État pour la confirmation de suppression
   const [openDelete, setOpenDelete] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);
 
   // Affichage de la confirmation de suppression
   const showPopconfirm = () => {
     setOpenDelete(true);
   };
 
   // Validation de la suppression
   const handleOk = async () => {
     const nouvelleListe = dataToDelete.map(element => element.delete === true ? element.id : undefined).join('-');
     setConfirmLoading(true);
 
     try {
       await mutate(nouvelleListe);
       setOpenDelete(false);
       message.success('La filière a été supprimée avec succès', 2);
       setDataToDelete([]);
     } catch (error) {
       console.error("Une erreur s'est produite lors de la suppression du formateur:", error);
       message.error('Une erreur s\'est produite lors de la suppression du formateur', 2);
     } finally {
       setConfirmLoading(false);
     }
   };
 

  // Annulation de la suppression
  const handleCancel = () => {
    message.error('La suppression a été annulée', 2);
    setOpenDelete(false);
  };

  // État pour stocker les données du formateur à modifier
  const [formateurMod,setFormateurMod]=useState({})

  // const options = [
  //   {
  //      1: <Link style={{textDecoration:"none"}} to={`/filiere/detail-filiere/${formateurDetailId}`}> <div  style={{fontSize:"16px",color:"rgb(0, 167, 111)",width:"100%", display:"flex",alignItems:"center"}}> <MdInfoOutline style={{fontSize:"18px", marginRight:"7px"}}/>   Détail</div></Link>
  //   },{
  //      2:<div  style={{fontSize:"16px",display:"flex",alignItems:"center"}}> <MdModeEditOutline  style={{marginRight:"7px"}}/> Editér</div>
  //   }
  // ];

  
const options = [
  
  {
    1: (
      <div style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
        <MdEdit style={{ marginRight: "7px" }} /> Éditer
      </div>
    )
  }
];

  // Notification de succès pour la modification du formateur
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      placement: "bottomRight",
      message: 'Modification Filière',
      description: 'Filière est modifiée avec succès',
      icon: (
        <SmileOutlined
          style={{
            color: '#007bff',
          }}
        />
      ),
      duration: 1.5
    });
  };

  // État et fonction pour la recherche de formateurs

  const [formDataSearch, setFormDataSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [valInit, setValpInit] = useState('~~');

  const { isLoading: loadingDataSearch, data: dataSearchValue } = useQuery(
    ['filiere-search', formDataSearch],
    async () => {
      try {
        // Ajouter une petite pause pour améliorer l'expérience utilisateur
        const response = await searchFiliereNext(currentPageRechercher, formDataSearch);
        setValpInit(formDataSearch);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    {
      enabled: isSearching && formDataSearch !== valInit || isSearching,
    }
  );

  const handleRemoveCache = () => {
    queryClient.removeQueries(['filiere-search',valInit]);
  };

  // Gestion de la recherche
  const handleSearch = () => {
    if (formDataSearch && valInit !== formDataSearch) {
      setIsSearching(true);

    }
  };

  const handlePageRechercher = (event, value) => {
    setCurrentPageRechercher(value);
    setIsSearching(true);

  };
  // Mise à jour des données globales après la recherche
  useEffect(() => {
    if (!loadingDataSearch && dataSearchValue?.formateurs) {
      setDataGlobal(dataSearchValue.formateurs);
      setCurrentPageRechercher(dataSearchValue.currentPage)
      setTotalePages({rechercher:dataSearchValue?.totalPages}); // Assurez-vous de définir setTotalPages correctement
      if(dataSearchValue.formateurs.length===0 && currentPageRechercher>1){
        setCurrentPageRechercher(page=>page-1)
      }
    }
  }, [loadingDataSearch, dataSearchValue?.formateurs]);

  // Réinitialisation de l'état de recherche après le chargement des données
  useEffect(() => {
    if (!loadingDataSearch) {
      setIsSearching(false);
      handleRemoveCache()
      setDataToDelete([])
    }
  }, [loadingDataSearch]);


  // Mise à jour des données globales après le chargement initial ou la recherche
  const [actualiser,setActualiser]=useState(false)
  useEffect(()=>{
    if(!isLoading ||formDataSearch===" " ){
      setDataGlobal(data?.formateurs)
      setTotalePages({datainit:data?.totalPages});
    }

    if(formDataSearch==""){
      setDataToDelete([])

    }
   
    
    if(data){
        if(data.formateurs.length===0 && currentPage>1){
           setCurrentPage(page=>page-1)
        }
    }
  },[isLoading,data,actualiser,formDataSearch])


  // Le tri des donnés .....
  const [order, setOrder] = useState('desc');
const [overButtonTh, setOverButtonTh]=useState('code')

const [currentValueTri,setCuurentValueTri]=useState('code')
  function triData(referenceData) {
    switch(referenceData) {
        case "code":
            setDataGlobal(prev => {
                if (order === "desc") {
                    return prev.sort((a, b) => b.code.localeCompare(a.code));
                } else {
                    return prev.sort((a, b) => a.code.localeCompare(b.code));
                }
            });
            break;
              case "description":
                setDataGlobal(prev => {
                    if (order === "desc") {
                        return prev.sort((a, b) => b.description.localeCompare(a.description));
                    } else {
                        return prev.sort((a, b) => a.description.localeCompare(b.description));
                    }
                });
                break;
                case "niveau":
                setDataGlobal(prev => {
                    if (order === "desc") {
                        return prev.sort((a, b) => parseInt(b.description) - parseInt(a.description));
                    } else {
                      return prev.sort((a, b) => parseInt(a.description) - parseInt(b.description));
                    }
                });
                break;
        default:
            break;
    }
}

function handleSort(referenceValue) {
  setOrder(order === 'desc' ? 'asc' : 'desc');
  triData(referenceValue);
  setCuurentValueTri(referenceValue)
}


const breadcrumbs = [
  <Link style={{fontSize:"15px", textDecoration:"none",color:"rgb(99, 115, 119,0.7)"}}  key="1" color="inherit" to="/dashboard" >
    Dashboard
  </Link>,
  <Typography style={{fontSize:"15px"}} key="3" color="text.primary">
    Liste des filières
  </Typography>,
];


const [openAddModule, setOpenAddModule] = useState(false);

const showDrawer = () => {
  setOpenAddModule(true);
};

const onClose = () => {
  setOpenAddModule(false);
}

// ********************************************
// *****************************************
//    LE RENDU
//    ____________________________________________________

// ------------------------------------------------------------------------


return (
    <section className='formateurs-container'>
         <Helmet>
      <title>Liste-Filiere | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
  {/* Affichage des notifications contextuelles */}
  {contextHolder}
  <Drawer width={480}  style={{padding:"0 10px"}} onClose={onClose} visible={openAddModule}>
          <NouvelleFiliere></NouvelleFiliere>
  </Drawer>
  {/* Conteneur pour la description et le bouton d'ajout de formateur */}
  <article className='description-container'>
       <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    {/* Lien vers la page d'ajout d'un nouveau formateur */}
    <Link>
      <Button onClick={showDrawer}>
        <FaPlus className='plusFormateur' />
        Nouvelle Filière
      </Button>
    </Link>
  </article>


  {/* Conteneur pour les filtres de recherche et d'exportation */}
  <article className='filter-container'>
    <div  style={{width:"100%"}} className="chargement">
      <div style={{width:"100%"}} className='filter-item-one'>
        {/* Champ de recherche avec bouton de rafraîchissement */}
        <CiSearch className='filter-search' />
        <input
          onChange={e => setFormDataSearch(e.target.value)}
          value={formDataSearch}
          onKeyUp={e => { if (e.key === 'Enter') handleSearch() }}
          className='filter-input'
          type="text"
          placeholder='Rechercher une filière ...'
        />
        <AiOutlineReload onClick={() => setActualiser(prev => !prev)} className="filter-button" />
      </div>
      {/* Affichage de la barre de progression lors du chargement de la recherche */}
      {loadingDataSearch && <LinearProgress style={{ height: "0.14rem", borderRadius: "10px", width: "97%" }} color="success" />}
    </div>
  </article>
  
  {/* Affichage des informations sur la suppression des formateurs */}
  {dataToDelete.some(element => element.delete === true) &&
    <div className='supressionData'>
      <span style={{ display: "flex", alignItems: "center" }}>
        {/* Nombre de formateurs sélectionnés pour la suppression */}
        <Checkbox
          {...label}
          onChange={handleClickToDelete}
          checked={dataToDelete.some(element => element.delete === true)}
          sx={{
            transform: "scale(0.8)",
            marginLeft: "12px",
            color: "rgb(99, 115, 129)",
            '&.Mui-checked': {
              color: "rgba(0, 167, 111, 0.897)",
            },
          }}
        />
        <span style={{ fontSize: "14px" }}> {
          dataToDelete.filter((formateur) => formateur.delete === true).length
        } <span> Filière sélectionnées</span> </span>
      </span>

      {/* Boîte de dialogue de confirmation pour la suppression */}
      <Popconfirm
        title="Suppression"
        description="Êtes-vous sûr de vouloir supprimer le formateur ?"
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
      >
        <IconButton aria-label="delete" onClick={showPopconfirm}>
          <DeleteIcon style={{ fontSize: "19px", color: "brown" }} />
        </IconButton>
      </Popconfirm>
    </div>
  }

       {/* Tableau des formateurs */}
  <table className='formateurs-table'>
    <thead>
      {/* En-têtes de colonne */}
      {
        !dataToDelete.some(element => element.delete === true) &&
        <tr>
          <th style={{ borderRadius: "3px 0 0 0" }}>
            {/* Case à cocher pour la sélection multiple */}
            <Checkbox
              {...label}
              onChange={handleClickToDelete}
              checked={dataToDelete.some(element => element.delete === true)}
              sx={{
                transform: "scale(0.8)",
                zIndex: 100000000,
                marginLeft: "10px",
                color: "rgb(99, 115, 129)",
                '&.Mui-checked': {
                  color: "rgba(0, 167, 111, 0.897)",
                },
              }}
            />
          </th>
          {/* En-têtes de colonne pour le tri */}
          <th>
            <button onMouseOver={() => setOverButtonTh("code")} className="buttonTH" onClick={() => handleSort('code')} >Code <FaArrowUp className={`${currentValueTri === "code" && order === "asc" ? "buttonTH-icons-rotate" : ""}  ${overButtonTh === "code" ? "iconsDiaplay" : ""} buttonTH-icons`} /> </button>
          </th>
          <th>
            <button onMouseOver={() => setOverButtonTh("description")} className="buttonTH" onClick={() => handleSort('description')}>Description <FaArrowUp className={`${currentValueTri === "description" && order === "asc" ? "buttonTH-icons-rotate" : ""}  ${overButtonTh === "description" ? "iconsDiaplay" : ""} buttonTH-icons`} /> </button>
          </th>
          <th>
            <button onMouseOver={() => setOverButtonTh("niveau")} className="buttonTH" onClick={() => handleSort('niveau')}>Niveau <FaArrowUp className={`${currentValueTri === "niveau" && order === "asc" ? "buttonTH-icons-rotate" : ""}  ${overButtonTh === "niveau" ? "iconsDiaplay" : ""} buttonTH-icons`} /> </button>
          </th>
        </tr>
      }
    </thead>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={openMenu}
          style={{ boxShadow: "none" }}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
              padding: "10px",
              borderRadius: "10px",
              outline: "0px",
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              // backgroundImage: `url(${backgroundImage}, url(${markPeopleImage})`,
              // backgroundRepeat: "no-repeat, no-repeat",
              // backgroundPosition: "right top, left bottom",
              // backgroundSize: "50%, 50%",
              boxShadow: "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px",
              overflow: "inherit",
              marginTop: "-6px",
            },
          }}
        >
          {options.map((option,index) => (
            <MenuItem  key={option}  onClick={()=>{
                 handleClickOpen()
              
              handleCloseMenu()
            }}>
              {option[index+1]}
            </MenuItem>
          ))}
        </Menu>
        
    {/* Affichage des données des formateurs */}
    <tbody className='formateurs-list'>
      {!isLoading && dataGlobal ?
        // Si les données sont chargées et qu'il y a des formateurs
        dataGlobal.length === 0 ?
          // Si aucune donnée n'est disponible
          // <div className="empty-container">
          //   <FaExclamationCircle size="large" />
          //   <p>Aucun résultat trouvé</p>
          // </div>
           <div className="empty-container">
          <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={
            <span>
              Aucun résultat trouvé 
            </span>
          }
        >
          <Link to="/formateur/ajouter-formateur"> <Button style={{color:"rgb(10, 148, 102)",fontSize:"12px", textTransform:'capitalize'}} type="primary">Ajouter maintenant</Button></Link>
        </Empty>
          </div>
          :
          // Affichage des données des formateurs
          dataGlobal.map((formateur, index) => (
            <tr key={index}>
              <td>
                {/* Case à cocher pour la sélection individuelle */}
                <Checkbox
                  {...label}
                  checked={dataToDelete.some(element => element.id === formateur.id && element.delete)}
                  onChange={(e) => onChangeInput(e, formateur.id)}
                  sx={{
                    transform: "scale(0.8)",
                    marginLeft: "10px",
                    color: "rgb(99, 115, 129)",
                    '&.Mui-checked': {
                      color: "rgba(0, 167, 111, 0.897)",
                    },
                  }}
                />
              </td>
              <td>{formateur?.code}</td>
              <td>{formateur?.description}</td>
              <td>{formateur?.niveau&&parseInt(formateur?.niveau)==1?"1 érè Année":"2 eme Année"}
                <div className='edition'>
                  {/* Options de modification des formateurs */}
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={openMenu ? 'long-menu' : undefined}
                    aria-expanded={openMenu ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={(event) => {
                      handleClick(event)
                      setFormateurMod(formateur)
                    }}
                  >
                    <MoreVertIcon style={{ fontSize: "16px" }} />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))
        : null}
    </tbody>
  </table>
  
  {/* Affichage de la barre de chargement */}
  {isLoading && <div style={{ padding: 0 ,width:"100%"}} >
    {/* Affichage des indicateurs de chargement */}
    {[1,2,3,4,5,6].map((_, index) => (
      <Skeleton baseColor='#f7f7f7' highlightColor='#ebebeb' style={{ margin: "5px 0", width: "100%", height: "45px" }} key={index} />
    ))}
  </div>}

  {/* Affichage de la pagination */}
  {data && data?.totalPages > 1 && (
    totalPages.datainit ? <section className="pagination">
      <Pagination page={currentPage} onChange={handlePageChange} count={totalPages.datainit} hidePrevButton hideNextButton />
    </section> :
      <section className="pagination">
        <Pagination page={currentPageRechercher} onChange={handlePageRechercher} count={totalPages.rechercher} hidePrevButton hideNextButton />
      </section>
  )}



  {/* Boîte de dialogue pour la modification d'un formateur */}
  <DialogContext setOpen={setOpen} open={open}>
    <FiliereMod openNotification={openNotification} handleClose={handleClose} currentPages={{ totalPages, currentPageRechercher, setIsSearching, currentPage, }} filiere={formateurMod} />
  </DialogContext>
</section>
  );
}

