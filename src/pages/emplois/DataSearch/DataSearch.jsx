import React,{useState,useEffect} from 'react';
import { CiSearch } from 'react-icons/ci';
import { AiOutlineReload } from 'react-icons/ai';
import LinearProgress from '@mui/material/LinearProgress';
import { BiAlarmAdd } from 'react-icons/bi';
import { Empty } from 'antd';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import {  Tag } from 'antd';
import { getEmploisFormateur } from '../../../request/createEmploisRequest/createEmploisRequest';
import { getFormateurGroupe } from '../../../request/groupeRequest/groupeRequest';
import useStore from '../../../store/useStore';
export default function DataSearch({ data }) {
  const toggleCurrentFormateurImpression=useStore(state=>state.toggleCurrentFormateurImpression)
  const {
    setFormDataSearch,
    refreshModuleList,
    loadingDataSearch,
    isLoadingGetGroupes,
    groupesFilter,
    isLoadingModuleFiliereGroupes,
    getModuleFiliereGroupe,
    handleSearch,
    formDataSearch,
    setDataSemploisSalle,
    setDataEmploisFormateur,
    setCurrentGroupeEmplois,
  } = data;

  
  // recuperation des moduel de groupes *********
  
  const [currentGroupe,setCurrentGroupe]=useState(null)
  const [errorServer,setErrorServer]=useState({})

  const { data: getFormateursGroupe, isLoading: isLoadinggetFormateursGroupe } = useQuery(
    ['get-formateur-groupe', currentGroupe],
    async () => {
      if (!currentGroupe) {
        throw new Error("L'ID du groupe n'est pas disponible");
      }
      try {
        const response = await getFormateurGroupe(currentGroupe);
        return response.data;
      } catch (error) {
        console.error(error);
        setErrorServer(error.response?.data || "Une erreur est survenue lors de la récupération des données");
        throw error;
      }
    },
    {
      enabled: !!currentGroupe
    }
  );

  // gestion de background color pour le groupe semection

  const [currentGroupeColor,setCurrentGroupeColor]=useState(null)
// *********************
// **************


// Utilisation du hook useState pour gérer l'état de l'ID de formateur sélectionné
const [idFormateurSelect, setIdFormateurSelect] = useState(null);


// Utilisation du hook useQuery pour récupérer les emplois du formateur sélectionné
const { data: getEmploisDataFormateur, isLoading: isLoadingDataEmploisFormateur } = useQuery(
  ['get-Emplois-formateur-unique', idFormateurSelect], 
  async () => {
    try {
      const response = await getEmploisFormateur(idFormateurSelect); // Appel de la fonction pour récupérer les emplois du formateur sélectionné
      return response.data; // Retourne les données des emplois de formateur
    } catch (error) {
      console.error(error); // Affiche une erreur en cas d'échec de la requête
      throw error;
    }
  }, 
  {
    enabled: !!idFormateurSelect // Active la requête uniquement si l'ID du formateur est sélectionné
  }
);

// Effet pour mettre à jour les données des emplois de formateur une fois qu'elles sont récupérées
useEffect(() => {
  if (!isLoadingDataEmploisFormateur && getEmploisDataFormateur) {
    setDataEmploisFormateur(prev => ({...prev, data: getEmploisDataFormateur, loading: false }));
  } else {
    setDataEmploisFormateur(prev => ({ ...prev, loading: isLoadingDataEmploisFormateur }));
  }
}, [isLoadingDataEmploisFormateur, getEmploisDataFormateur]);

// Effet pour gérer l'état de la sélection du formateur
useEffect(() => {
  if (idFormateurSelect) {
    setDataEmploisFormateur(prev => ({ ...prev, selectedFormateur: true }));
  }
}, [idFormateurSelect]);


  return (
    <section className="groupe-module-section-emplois">
      <div className="div-groupe-ul" style={{ height: "45%"}}>
        <div className="chargement chargement-module">
          <div className="filter-item-one" style={{ width: "100%" }}>
            <CiSearch className="filter-search" />
            <input
              type="text"
              className="filter-input"
              placeholder="Rechercher un groupe ..."
              style={{ fontSize: "15px" }}
              value={formDataSearch}
              onChange={(e) => setFormDataSearch(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <AiOutlineReload onClick={refreshModuleList} className="filter-button" />
          </div>
          {loadingDataSearch && (
            <LinearProgress
              style={{ height: "0.14rem", borderRadius: "10px", width: "97%" }}
              color="success"
            />
          )}
        </div>
        <ul  className="groupedisponible-emplois" style={{ marginBottom:"10px" , height: "170px" }}>
          {isLoadingGetGroupes ? (
            <div className="container" style={{ padding: 0 }}>
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton
                  key={index}
                  baseColor="#f7f7f7"
                  highlightColor="#ebebeb"
                  style={{ margin: "5px 0", width: "100%", height: "35px" }}
                />
              ))}
            </div>
          ) : groupesFilter?.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 60, marginTop: "30px" }}
              description={<span>Aucun résultat trouvé</span>}
            />
          ) : (
            groupesFilter.map((groupe, index) => (
              <li
                key={index}
                className={`${currentGroupeColor===index?"elementHoverBackground  hoverColor":""}`}
                onClick={() => {setCurrentGroupeColor(index) ; setCurrentGroupe(groupe.id) ;setCurrentGroupeEmplois({ code: groupe.code, id: groupe.id })}}
              >
                <span>{groupe.code}</span>
                <BiAlarmAdd className="color-icons-add-emplois" />
              </li>
            ))
          )}
        </ul>
      </div>
      
      <div style={{margin:"10px 0"}} className="module-groupe-text">Formateurs</div>
      <div className="div-groupe-ul" style={{ height: "45%" }}>
        <ul className="groupedisponible-emplois" style={{ height: "170px" }}>
           {isLoadinggetFormateursGroupe ? (
            <div className="container" style={{ padding: 0 }}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Skeleton
                  key={index}
                  baseColor="#f7f7f7"
                  highlightColor="#ebebeb"
                  style={{ margin: "5px 0", width: "100%", height: "35px" }}
                />
              ))}
            </div>
          ) : !getFormateursGroupe || getFormateursGroupe.length === 0 ? (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 60, marginTop: "30px" }}
              description={<span>Aucun module trouvé</span>}
            />
          ) : (
            getFormateursGroupe.map((formateur, index) => (
              <li style={{display:"flex",alignItems:"center",justifyContent:"space-between"}} key={index}>
                <span style={{color:"#000", textTransform:"capitalize"}}>
                  {/* <GiBookmark className="color-icons-add-emplois icons-modules" />
                  {module?.description.toUpperCase()} */}
                  {formateur.nom}  {formateur.prenom}
                  </span>
                 
<Tag  style={{cursor:"pointer"}} color={formateur.id > 0 ? 'geekblue' : 'green'} key={index}  onClick={() => {  
  toggleCurrentFormateurImpression(formateur.id)
  setDataSemploisSalle(prev=> ({...prev,selectedSalle:false}))
;setDataEmploisFormateur(prev => ({ ...prev, selectedFormateur: true })); setIdFormateurSelect(formateur.id) }}>
      Disponibilités
</Tag>
              
              </li>
            ))
          )}
        </ul> 
      </div>
    </section>
  );
}

