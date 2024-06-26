import  { useEffect, useState } from 'react';
import { AiOutlineReload } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import Modifcation from './Modifcation'; // Importation du composant de modification
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
import { searchFormateurNext ,supprimerformateur ,listeTousFormateurNonPagine ,listeFormateur} from '../../../request/formateurRequest/formateurRequest';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { message } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { FaArrowUp } from "react-icons/fa6";
import LinearProgress from '@mui/material/LinearProgress';
import { PiExportBold } from "react-icons/pi";
import {  Popover } from 'antd';
import { Tooltip } from 'antd';
import { Helmet } from 'react-helmet';
import {  Empty } from 'antd';
import { PDFDownloadLink } from '@react-pdf/renderer';
import IndexPDF from '../../../pdf/listeFormateur/IndexPDF';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import useStore from '../../../store/useStore';

import { Drawer } from 'antd';

import { MdAssignment, MdEdit, MdCloudDownload } from 'react-icons/md';
import NouveauFormateur from '../ajout/NouveauFormateur';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const ITEM_HEIGHT = 48;

export default function ListeFormateurs() {

  const toggleCurrentIDSelected = useStore(state => state.toggleCurrentIDSelected);

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
  const { data, isLoading } = useQuery(['liste-formateur',currentPage], async () => {
    try {
      const response = await listeFormateur(currentPage);
      return response.data;
    } catch (error) {{
       throw error
    }
    }
  });

// Avce use Effect
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

// ****************************************************************
// DEBUT DE SUPPRESSION.
const [dataToDelete, setDataToDelete] = useState([]);
const [deleteTrChecked, setDeleteTrChecked] = useState(false);

function handleClickToDelete(event) {
  setDeleteTrChecked(event.target.checked);
  if (event.target.checked && dataGlobal) {
    setDataToDelete(dataGlobal.map(element => ({ id: element.id, delete: true })));
  } else {
    setDataToDelete(dataGlobal.map(element => ({ id: element.id, delete: false })));
  }
}

function onChangeInput(e, index) {
  if (dataToDelete.find((element) => element.id === index)) {
    setDataToDelete(prev => prev.map(element => (element.id === index ? { ...element, delete: e.target.checked } : element)));
  } else {
    setDataToDelete(prev => ([...prev, { id: index, delete: e.target.checked }]));
  }
}

const queryClient = useQueryClient();

const { mutate } = useMutation(async (data) => {
  try {
    await supprimerformateur(data);
  } catch (error) {
     throw new Error(error)
  }
}, {
  onSuccess: () => {
    if (totalPages.datainit) {
      queryClient.invalidateQueries(['liste-formateur', currentPage]);
    }
    if (totalPages.rechercher) {
      queryClient.invalidateQueries(['formateur-search-formateur', currentPageRechercher]);
      setIsSearching(true);
    }
  }
});

const [openDelete, setOpenDelete] = useState(false);
const [confirmLoading, setConfirmLoading] = useState(false);

const showPopconfirm = () => {
  setOpenDelete(true);
};

const handleOk = async () => {
  const nouvelleListe = dataToDelete.map(element => element.delete === true ? element.id : undefined).join('-');
  setConfirmLoading(true);

  try {
    await mutate(nouvelleListe);
    setOpenDelete(false);
    message.success('Le formateur a été supprimé avec succès', 2);
    setDataToDelete([]);
  } catch (error) {
     throw new Error(error)
  }
  finally {
    setConfirmLoading(false);
  }
};

const handleCancel = () => {
  message.error('La suppression a été annulée', 2);
  setOpenDelete(false);
};

 // ****************************************************************
// FIN DE SUPPRESSION.

  

  
 // ****************************************************************
// FORMATEUR A MODIFIER.
const [formateurMod, setFormateurMod] = useState({});
const [formateurDetailId, setFormateurDetailId] = useState(null);

const options = [
  {
    1: (
      <Link style={{ textDecoration: "none" }} to={`/dashboard/formateur/detail-formateur/${formateurDetailId}`}>
        <div style={{ fontSize: "16px", color: "rgb(0, 167, 111)", width: "100%", display: "flex", alignItems: "center" }}>
          <MdAssignment style={{ fontSize: "18px", marginRight: "7px" }} /> Affectation
        </div>
      </Link>
    )
  },
  {

    2: (
      <div style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
        <MdEdit style={{ color:"rgb(10, 148, 102)",marginRight: "7px" }} /> Éditer
      </div>
    )
  },
  {
    3:
    (
      <div  onClick={()=>toggleCurrentIDSelected(formateurDetailId,'formateur')}  style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
        <MdCloudDownload style={{cursor:"pointer", color:"rgb(10, 148, 102)", marginRight: "7px" }} /> Télécharger
      </div>
    )
  }
];




const [api, contextHolder] = notification.useNotification();

const openNotification = () => {
  api.open({
    placement: "bottomRight",
    message: 'Modification Formateur',
    description: 'Formateur est modifié avec succès',
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

 // ****************************************************************
//  FIN GESTION.



 // ****************************************************************
// DEBUT DE LA RECHERCHE .

const [formDataSearch, setFormDataSearch] = useState('');
const [isSearching, setIsSearching] = useState(false);
const [valInit, setValpInit] = useState('~~');

const { isLoading: loadingDataSearch, data: dataSearchValue } = useQuery(
  ['formateur-search-formateur', formDataSearch],
  async () => {
    try {
      const response = await searchFormateurNext(currentPageRechercher, formDataSearch);
      setValpInit(formDataSearch);
      return response.data;
    } catch (error) {{
      throw new Error(error)
    }    }
  },
  {
    enabled: (isSearching && formDataSearch !== valInit) || isSearching,
  }
);

const handleRemoveCache = () => {
  queryClient.removeQueries(['formateur-search-formateur', valInit]);
};

const handleSearch = () => {
  if (formDataSearch && valInit !== formDataSearch) {
    setIsSearching(true);

  }
};

const handlePageRechercher = (event, value) => {
  setCurrentPageRechercher(value);
  setIsSearching(true);
};

useEffect(() => {
  if (!loadingDataSearch && dataSearchValue?.formateurs) {
    setDataGlobal(dataSearchValue.formateurs);
    setCurrentPageRechercher(dataSearchValue.currentPage);
    setTotalePages({ rechercher: dataSearchValue?.totalPages });
    if (dataSearchValue.formateurs.length === 0 && currentPageRechercher > 1) {
      setCurrentPageRechercher(page => page - 1);
    }
  }
}, [loadingDataSearch, dataSearchValue?.formateurs]);

useEffect(() => {
  if (!loadingDataSearch) {
    setIsSearching(false);
    handleRemoveCache();
    setDataToDelete([]);
  }
}, [loadingDataSearch]);

const [actualiser, setActualiser] = useState(false);

useEffect(() => {
  if (!isLoading || formDataSearch === " ") {
    setDataGlobal(data?.formateurs);
    setTotalePages({ datainit: data?.totalPages });
  }

  if (formDataSearch === "") {
    setDataToDelete([]);
  }

  if (data) {
    if (data.formateurs.length === 0 && currentPage > 1) {
      setCurrentPage(page => page - 1);
    }
  }
}, [isLoading, data, actualiser, formDataSearch]);

// ****************************************************************
// FIN DE LA RECHERCHE .




// ****************************************************************
// TRIS DES DONNEES .

  const [order, setOrder] = useState('desc');
const [overButtonTh, setOverButtonTh]=useState('matricule')

const [currentValueTri,setCuurentValueTri]=useState('matricule')
  function triData(referenceData) {
    switch(referenceData) {
        case "nom":
            setDataGlobal(prev => {
                if (order === "desc") {
                    return prev.sort((a, b) => b.nom.localeCompare(a.nom));
                } else {
                    return prev.sort((a, b) => a.nom.localeCompare(b.nom));
                }
            });
            break;
          case "prenom":
              setDataGlobal(prev => {
                  if (order === "desc") {
                      return prev.sort((a, b) => b.prenom.localeCompare(a.prenom));
                  } else {
                      return prev.sort((a, b) => a.prenom.localeCompare(b.prenom));
                  }
              });
              break;
              case "matricule":
                setDataGlobal(prev => {
                    if (order === "desc") {
                        return prev.sort((a, b) => b.matricule.localeCompare(a.matricule));
                    } else {
                        return prev.sort((a, b) => a.matricule.localeCompare(b.matricule));
                    }
                });
                break;
                case "metier":
                setDataGlobal(prev => {
                    if (order === "desc") {
                        return prev.sort((a, b) => b.metier.localeCompare(a.metier));
                    } else {
                        return prev.sort((a, b) => a.metier.localeCompare(b.metier));
                    }
                });
                break;
                case "email":
                  setDataGlobal(prev => {
                      if (order === "desc") {
                          return prev.sort((a, b) => b.email.localeCompare(a.email));
                      } else {
                          return prev.sort((a, b) => a.email.localeCompare(b.email));
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

// ****************************************************************
// Fin TRIS DES DONNEES .




// ****************************************************************
// DEBUT EXPORTATION DES DONNEES EN PDF .
const [openExport, setOpenExport] = useState(false);

const hide = () => {
  setOpenExport(false);
};

const handleOpenChangeex = (newOpen) => {
  setOpenExport(newOpen);
};

const { data: tousFormateursData, isLoading: isLoadingTousFormateursData } = useQuery(
  ['liste-formateur-non-pagine', dataGlobal],
  async () => {
    try {
      const response = await listeTousFormateurNonPagine();
      return response.data;
    } catch (error) {{
      throw new Error(error)
    }
    }
  }
);

const [dataToExport, setDataToExport] = useState({
  matricule: true,
  nom: true,
  prenom: true,
  metier: true,
  tousFormateurs: false,
});

const [dataToExportCopy, setDataToExportCopy] = useState([]);
const [dataFinalToExport, setDataFinalToExport] = useState([]);

function onHandleChangeExport(e) {
  const { checked, name } = e.target;
  setDataToExport(prev => ({ ...prev, [name]: checked }));
}

useEffect(() => {
  if (!isLoadingTousFormateursData && dataToExport.tousFormateurs) {
    setDataToExportCopy(tousFormateursData);
  } else {
    if(dataGlobal){
      setDataToExportCopy([...dataGlobal]);
    }
  }
}, [dataGlobal, dataToExport.tousFormateurs]);

useEffect(() => {
  const updatedDataCopy = dataToExportCopy.map(data => {
    if (!dataToExport.matricule) {
      data = { ...data, matricule: undefined };
    }
    if (!dataToExport.nom) {
      data = { ...data, nom: undefined };
    }
    if (!dataToExport.prenom) {
      data = { ...data, prenom: undefined };
    }
    if (!dataToExport.metier) {
      data = { ...data, metier: undefined };
    }
    return data;
  }).map(data => {
    const newData = {};
    if (data.matricule) {
      newData.matricule = data.matricule;
    }
    if (data.nom) {
      newData.nom = data.nom;
    }
    if (data.prenom) {
      newData.prenom = data.prenom;
    }
    if (data.metier) {
      newData.metier = data.metier;
    }
    return newData;
  }).filter(data => {
    return Object.keys(data).length > 0;
  });

  setDataFinalToExport(updatedDataCopy);
}, [dataToExport, dataToExportCopy]);


// ****************************************************************
// FIN EXPORTATION DES DONNEES EN PDF .


const breadcrumbs = [
  <Link style={{fontSize:"15px", textDecoration:"none",color:"rgb(99, 115, 119,0.7)"}}  key="1" color="inherit" to="/dashboard" >
    Dashboard
  </Link>,
  <Typography style={{fontSize:"15px"}} key="3" color="text.primary">
    Liste des formateurs
  </Typography>,
];


const [openAddModule, setOpenAddModule] = useState(false);

const showDrawer = () => {
  setOpenAddModule(true);
};

const onCloseDrawer = () => {
  setOpenAddModule(false);
}

return (
    <section className='formateurs-container'>
  {/* Affichage des notifications contextuelles */}
  {contextHolder}
  <Helmet>
      <title>Liste-Formateur | E-Emplois</title>        <meta name="description" content="Gérez votre profil et vos emploi du temps sur E-emplois. Accédez aux statistiques et aux informations importantes." />
        <meta name="keywords" content="e-emplois, emploi en ligne, dashboard, gestion d'emploi du temps" />
        <meta name="author" content="Votre nom ou nom de l'organisation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <Drawer width={480}  style={{padding:"0 10px"}} onClose={onCloseDrawer} visible={openAddModule}>
          <NouveauFormateur></NouveauFormateur>
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
        Nouvelle Formateur
      </Button>
    </Link>
  </article>


  {/* Conteneur pour les filtres de recherche et d'exportation */}
  <article className='filter-container'>
    <div className="chargement">
      <div className='filter-item-one'>
        {/* Champ de recherche avec bouton de rafraîchissement */}
        <CiSearch className='filter-search' />
        <input
          onChange={e => setFormDataSearch(e.target.value)}
          value={formDataSearch}
          onKeyUp={e => { if (e.key === 'Enter') handleSearch() }}
          className='filter-input'
          type="text"
          placeholder='Rechercher un formateur ...'
        />
        <AiOutlineReload onClick={() => setActualiser(prev => !prev)} className="filter-button" />
      </div>
      {/* Affichage de la barre de progression lors du chargement de la recherche */}
      {loadingDataSearch && <LinearProgress style={{ height: "0.14rem", borderRadius: "10px", width: "97%" }} color="success" />}
    </div>
    <div className='filter-item-two'>
      {/* Bouton d'exportation de la liste en PDF */}
      <Tooltip color={"cyan"} key={"cyan"} placement="top" title={<span className="wider-text">Exporter la liste en PDF</span>}>
  <Popover
    placement='top'
    content={
      <div>
        <Button className='button-popover' style={{color:"red",textTransform:"capitalize"}} onClick={hide}>Fermer</Button>
        <Button  className='button-popover'  style={{color:"rgba(0, 167, 111, 0.897)",textTransform:"capitalize"}}>
        <PDFDownloadLink
  style={{ color: "rgba(0, 167, 111, 0.897)", textDecoration: "none" }}
  document={<IndexPDF data={dataFinalToExport ? dataFinalToExport : []} />}
  fileName="liste_formateurs.pdf">
  {({ blob, url, loading, error }) => (loading ? "Exporter" : 'Exporter')}
</PDFDownloadLink>
       
       </Button>
      </div>
    }
    title={
      <section className='sectionPopover'>
        <div className="popover-title">
          <div className='titrePopover-div'>Spécifier les champs à exporter</div>
          <div>
            <span className='conatiner-input-popover'>
              <Checkbox
                {...label}
                name='matricule'
                checked={dataToExport.matricule}
                onChange={onHandleChangeExport}
                sx={{
                  transform: "scale(0.8)",
                  margin:0,
                  color: "rgb(99, 115, 129)",
                  padding:1,
                  '&.Mui-checked': {
                    color: "rgba(0, 167, 111, 0.897)",
                  },
                }}
              /> <label htmlFor="Matricule">Matricule</label>
            </span>
            <span className='conatiner-input-popover'>
              <Checkbox
                {...label}
                checked={dataToExport.nom}
                name='nom'
                onChange={onHandleChangeExport}
                sx={{
                  transform: "scale(0.8)",
                  color: "rgb(99, 115, 129)",
                  padding:1,
                  '&.Mui-checked': {
                    color: "rgba(0, 167, 111, 0.897)",
                  },
                }}
              /><label htmlFor="Nom">Nom</label>
            </span>
            <span className='conatiner-input-popover'>  
              <Checkbox
                {...label}
                checked={dataToExport.prenom}
                name='prenom'
                onChange={onHandleChangeExport}
                sx={{
                  transform: "scale(0.8)",
                  color: "rgb(99, 115, 129)",
                  padding:1,
                  '&.Mui-checked': {
                    color: "rgba(0, 167, 111, 0.897)",
                  },
                }}
              /> <label htmlFor="Prénom">Prénom</label>
            </span>
            <span className='conatiner-input-popover'>
              <Checkbox
                {...label}
                checked={dataToExport.metier}
                name='metier'
                onChange={onHandleChangeExport}
                sx={{
                  transform: "scale(0.8)",
                  color: "rgb(99, 115, 129)",
                  padding:1,
                  '&.Mui-checked': {
                    color: "rgba(0, 167, 111, 0.897)",
                  },
                }}
              /> <label htmlFor="Métier">Métier</label>
            </span>
          </div>
        </div>
        <div className='conatiner-input-popover'>
          <Checkbox
            {...label}
            name='tousFormateurs'
            checked={dataToExport.tousFormateurs}
            onChange={onHandleChangeExport}
            sx={{
              transform: "scale(0.8)",
              color: "rgb(99, 115, 129)",
              padding:1,
              '&.Mui-checked': {
                color: "rgba(0, 167, 111, 0.897)",
              },
            }}
          />
          <label htmlFor="">Tous les formateurs ?</label>
        </div>
      </section>
    }
    trigger="click"
    open={openExport}
    onOpenChange={handleOpenChangeex}
  >
    <IconButton
      aria-label="more"
      id="long-button"
      style={{ fontSize: "20px" }}
      aria-haspopup="true"
      disabled={!(dataFinalToExport.length > 0 && dataFinalToExport)}

    >
      <PiExportBold />
    </IconButton>
  </Popover>
</Tooltip>

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
            zIndex:1,
            color: "rgb(99, 115, 129)",
            '&.Mui-checked': {
              color: "rgba(0, 167, 111, 0.897)",
            },
          }}
        />
        <span style={{ fontSize: "14px" }}> {
          dataToDelete.filter((formateur) => formateur.delete === true).length
        } <span> Formateurs sélectionnés</span> </span>
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
            <button onMouseOver={() => setOverButtonTh("matricule")} className="buttonTH" onClick={() => handleSort('matricule')} >Matricule <FaArrowUp className={`${currentValueTri === "matricule" && order === "asc" ? "buttonTH-icons-rotate" : ""}  ${overButtonTh === "matricule" ? "iconsDiaplay" : ""} buttonTH-icons`} /> </button>
          </th>
          <th>
            <button onMouseOver={() => setOverButtonTh("nom")} className="buttonTH" onClick={() => handleSort('nom')}>Nom <FaArrowUp className={`${currentValueTri === "nom" && order === "asc" ? "buttonTH-icons-rotate" : ""}  ${overButtonTh === "nom" ? "iconsDiaplay" : ""} buttonTH-icons`} /> </button>
          </th>
          <th>
            <button onMouseOver={() => setOverButtonTh("prenom")} className="buttonTH" onClick={() => handleSort('prenom')}>Prénom <FaArrowUp className={`${currentValueTri === "prenom" && order === "asc" ? "buttonTH-icons-rotate" : ""}  ${overButtonTh === "prenom" ? "iconsDiaplay" : ""} buttonTH-icons`} /> </button>
          </th>
          <th>
            <button onMouseOver={() => setOverButtonTh("email")} className="buttonTH" onClick={() => handleSort('email')}>Email <FaArrowUp className={`${currentValueTri === "email" && order === "asc" ? "buttonTH-icons-rotate" : ""}  ${overButtonTh === "email" ? "iconsDiaplay" : ""} buttonTH-icons`} /> </button>
          </th>
          <th style={{ borderRadius: "0 3px 0 0" }}>
            <button onMouseOver={() => setOverButtonTh("metier")} className="buttonTH" onClick={() => handleSort('metier')}>Métier <FaArrowUp className={`${currentValueTri === "metier" && order === "asc" ? "buttonTH-icons-rotate" : ""}  ${overButtonTh === "metier" ? "iconsDiaplay" : ""} buttonTH-icons`} /> </button>
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
              boxShadow: "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px",
              overflow: "inherit",
              marginTop: "-6px",
            },
          }}
        >
          {options.map((option,index) => (
            <MenuItem  key={option}  onClick={()=>{
              if(index===1){
                 handleClickOpen()
              }
              handleCloseMenu()
            }}>
              {option[index+1]}
            </MenuItem>
          ))}
        </Menu>
        
    {/* Affichage des données des formateurs */}
    <tbody className='formateurs-list'>
      {!isLoading&&dataGlobal ?
        // Si les données sont chargées et qu'il y a des formateurs
        dataGlobal.length === 0 ?
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
              <td>{formateur.matricule}</td>
              <td>{formateur.nom}</td>
              <td>{formateur.prenom}</td>
              <td>{formateur.email}</td>
              <td>{formateur.metier}
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
                      setFormateurDetailId(formateur.id)
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
  {isLoading && <div style={{ padding: 0,width:"100%" }}>
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
    <Modifcation openNotification={openNotification} handleClose={handleClose} currentPages={{ totalPages, currentPageRechercher, setIsSearching, currentPage, }} formateur={formateurMod} />
  </DialogContext>
</section>
  );
}

