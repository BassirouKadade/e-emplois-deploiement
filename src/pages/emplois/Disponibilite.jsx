import React, { useEffect, useState } from 'react';
import { Menu, Tag, notification } from 'antd';
import { IoIosHome } from "react-icons/io";
import { MdOutlineSocialDistance } from "react-icons/md";
import '../../styles/emplois/Disponibilte.css'
import Skeleton from 'react-loading-skeleton';
import { creerEmplois } from '../../request/createEmploisRequest/createEmploisRequest';
import { useQueryClient, useMutation } from 'react-query';
import Progress from '../../components/Progess';
import { UserOutlined } from '@ant-design/icons';
import { FaTimes } from 'react-icons/fa';


// Composant principal
export default function Disponibilite({ formateurs,nombreSeance,setEmploisData, day, handleClose, top, isLoadingSalleGet, setStartFetching, width, start, end, salles, currentGroupeEmplois }) {
  const [salleSelect, setSalleSelect] = useState(null); // État pour la salle sélectionnée
  const [dataSendToServer, setDataSendToServer] = useState({
    startIndex: null,
    startEnd: null,
    idSalle: null,
    idGroupe: null,
    day: null,
    top: null,
    idFormateur:null,
    idModule:null
  });

  const nombreSeanceSelectionne = width / 45;
  const resultNombreSeance = nombreSeanceSelectionne * 0.5;



  const [salleMrest, setSalleMrest] = useState(0); // État pour la salle restante
  const [error, setError] = useState({duree:false, idModule:false,allowNullSalle:false, heureDisponible: false, groupe: false, salle: false }); // État pour les erreurs

  // Gestion de la sélection de la salle
  const onHandleSalle = (id, rest) => {
    setSalleMrest(rest);
    setDataSendToServer((prev) => ({ ...prev, idSalle: id }));
  };


  const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']); // État pour les clés de menu ouvertes

  // Gestion de l'ouverture du menu
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => !stateOpenKeys.includes(key));
    if (currentOpenKey) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  const [errorServer, setErrorServer] = useState({}); // État pour les erreurs serveur
  const queryClient = useQueryClient(); // Client pour les requêtes React Query

  // Mutation pour créer les emplois du temps
   
  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      const response = await creerEmplois(data);
      return response;
    } catch (error) {
      setErrorServer(error.response?.data || 'An error occurred');
      throw error;
    }
  }, {
    onSuccess: (data) => {
      handleClose();
      if(data?.data){
        setEmploisData(data?.data)
      }
      queryClient.invalidateQueries('get-totale-seance-groupe');
      queryClient.invalidateQueries('get-emplois-groupe');
      queryClient.invalidateQueries('get-Emplois-salle');
      queryClient.invalidateQueries('get-Module-Filiere-groupe');

      

    },
  });


  
// Déclaration des états pour stocker les formateurs disponibles, l'ID du formateur sélectionné et la clé de l'enfant sélectionné
const [formateurDisponible, setFormateurDisponible] = useState([]);
const [idFormateur, setIdFormateur] = useState(null);
const [selectedChildKey, setSelectedChildKey] = useState(null);

// useEffect pour mettre à jour la liste des formateurs disponibles lorsque les données des formateurs ou l'état de chargement changent
useEffect(() => {
  if (!isLoadingSalleGet && formateurs) {
    // Mappage des formateurs pour créer une structure de données avec clés, icônes et libellés
    const listeMap = formateurs.map((element) => {
      return {
        key: element.id,
        icon: <UserOutlined />,
        label: (
          <span>
            {element.nom} {element.prenom}
          </span>
        ),
        children: element.modules
          ? element.modules.map((module) => ({
              // Génération d'une clé unique pour chaque module en utilisant des littéraux de gabarits
              key: `${module.id}del${Date.now()}${Math.random() + 100}`,
              label: module.description,
            }))
          : [],
      };
    });
    // Mise à jour de l'état avec la nouvelle liste de formateurs
    setFormateurDisponible(listeMap);
  }
}, [isLoadingSalleGet, formateurs]);

// Gestion de la sélection dans le menu
const handleSelect = ({ key, keyPath }) => {
  if (keyPath.length > 1) {
    // Si la clé sélectionnée appartient à un enfant, définir l'ID du formateur et la clé de l'enfant
    setIdFormateur(keyPath[1]);
    setSelectedChildKey(key);
  } else {
    // Sinon, définir uniquement l'ID du formateur
    setIdFormateur(key);
    setSelectedChildKey(null);
  }
};

// Déclaration de l'état pour stocker l'ID du module sélectionné
const [idModule, setIdModule] = useState('');

// useEffect pour extraire l'ID du module à partir de la clé de l'enfant sélectionné
useEffect(() => {
  // Fonction pour extraire la partie avant "del" de la clé
  const extractPartBeforeDel = (str) => {
    const regex = /^(\d+)del/;
    const match = str.match(regex);
    return match ? match[1] : '';
  };

  // Si une clé d'enfant est sélectionnée, extraire et définir l'ID du module
  if (selectedChildKey) {
    const extractedPart = extractPartBeforeDel(selectedChildKey);
    setIdModule(extractedPart);
  }
}, [selectedChildKey]);


// Fonction pour obtenir les niveaux des clés du menu
const getLevelKeys = (items) => {
  const keys = {};
  const traverse = (items, level = 1) => {
    items.forEach((item) => {
      if (item.key) {
        keys[item.key] = level;
      }
      if (item.children) {
        traverse(item.children, level + 1);
      }
    });
  };
  traverse(items);
  return keys;
};

// Obtenir les niveaux des clés pour le menu

  // Mise à jour des données à envoyer au serveur
  useEffect(() => {
    setDataSendToServer((prev) => ({
      ...prev,
      startEnd: end,
      startIndex: start,
      day: day,
      width: width,
      top: top,
      idModule:idModule,
      idFormateur:idFormateur,
      idGroupe: currentGroupeEmplois?.id,
    }));
  }, [currentGroupeEmplois?.id, idFormateur,idModule,day, top, start, end]);

const levelKeys = getLevelKeys(formateurDisponible);


  const [typeSeanceToSend, setTypeSeanceToSend] = useState(null); // État pour le type de séance à envoyer

  const moduelFormateur= formateurs?.find(formateur=>formateur.id===parseInt(idFormateur));
  const moduleFindEtat=moduelFormateur?.modules.find(module=>module.id===parseInt(idModule));
  const dureeRestante=moduleFindEtat?.dureeRest

  const [dureeR,setDureeR]=useState(null)

  useEffect(() => {
    setDureeR(dureeRestante)
  }, [dureeRestante])
  // Gestion de l'envoi des données au serveur
  const onHandleSendDataTOServer = (typeSeance) => {


    if (!dataSendToServer.idGroupe) {
      setError(prev => ({ ...prev, groupe: true }));
      return;
    }
    if (!dataSendToServer.idSalle &&typeSeance==="FP") {
      setError(prev => ({ ...prev, salle: true }));
      return;
    }
    if (nombreSeance > salleMrest && typeSeance==="FP") {
      setError(prev => ({ ...prev, heureDisponible: true }));
      return;
    }
    if (idModule ===null || !idModule) {
      setError(prev => ({ ...prev, idModule: true }));
      return;
    }

    if (dataSendToServer.idSalle&&typeSeance==="FAD") {
      setError(prev => ({ ...prev, allowNullSalle: true }));
      return;
    }
    if (resultNombreSeance>dureeRestante ) {
      setError(prev => ({ ...prev, duree: true }));
      return;
    }

    
    dataSendToServer.typeSeance = typeSeance;
    mutate(dataSendToServer);
  };

  const [api, contextHolder] = notification.useNotification(); // Notification API

// Fonction pour ouvrir une notification lorsque le groupe n'est pas défini
const openNotificationGroupNotDefined = (type) => {
  api[type]({
    message: 'Alerte Groupe Non Défini',
    description: "Veuillez sélectionner un groupe pour pouvoir créer l'emploi du temps.",
  });
};

// Fonction pour ouvrir une notification lorsque la salle n'est pas définie
const openNotificationRoomNotDefined = (type) => {
  api[type]({
    message: 'Alerte Salle Non Définie',
    description: "Veuillez sélectionner une salle pour pouvoir créer l'emploi du temps.",
  });
};

// Fonction pour ouvrir une notification lorsque la disponibilité de la salle est insuffisante
const openNotificationRoomAvailability = (type) => {
  api[type]({
    placement: "topLeft",
    message: 'Alerte Disponibilité Salle',
    description: "La disponibilité horaire de la salle sélectionnée est insuffisante. Veuillez choisir une autre salle ou ajuster l'emploi du temps.",
  });
};


  // Fonction pour ouvrir une notification pour la disponibilité de la salle
// Fonction pour afficher une notification lorsqu'aucun formateur n'est défini
const openNotificationWithIconsFormateurIndefini = (type) => {
  api[type]({
    placement: "topLeft",
    message: 'Aucun formateur défini',
    description: "Le formateur et le module doivent être sélectionnés pour pouvoir créer l'emploi du temps.",
  });
};

const openNotificationWithIconsallowNullSalle = (type) => {
  api[type]({
    placement: "topLeft",
    message: 'Salle Définie',
    description: "La salle ne doit pas être sélectionnée pour une formation à distance.",
  });
};

const openNotificationWithIconsDuree = (type) => {
  api[type]({
    placement: "topLeft",
    message: 'Module Indisponible',
    description: `La durée restante du module est de ${dureeR} heures.`,
  });
};

  // Gestion des notifications d'erreur
  useEffect(() => {
    if (error?.groupe) {
      openNotificationGroupNotDefined('error');
    }
    if (error?.salle) {
      openNotificationRoomNotDefined('error');
    }
    if (error?.heureDisponible) {
      openNotificationRoomAvailability('error');
    }
    if (error?.idModule) {
      openNotificationWithIconsFormateurIndefini('error');
    }
    if (error?.allowNullSalle) {
      openNotificationWithIconsallowNullSalle('error');
    }
    if (error?.duree) {
      openNotificationWithIconsDuree('error');
    }

    
    
    setTimeout(() => {
      setError({ groupe: false, salle: false });
    }, 1000);
  }, [error]);


  return (
    <div className='disponiblite-data'>
      {contextHolder}
      <article className="type-cours">
        <span onClick={() => { setTypeSeanceToSend("FP"); onHandleSendDataTOServer('FP') }} className='type type-PRE'>
          {
            isLoading && typeSeanceToSend === "FP" ? 
              <Progress w={"25px"} h={"25px"} color={'white'} /> : 
              <>
                <IoIosHome style={{ marginRight: "5px" }} /> 
                Présentiel
              </>
          }
        </span>
        <span onClick={() => { setTypeSeanceToSend('FAD'); onHandleSendDataTOServer('FAD') }} className='type type-FAD'>
          {
            isLoading && typeSeanceToSend === "FAD" ? 
              <Progress w={"25px"} h={"25px"} color={'white'} /> : 
              <>
                <MdOutlineSocialDistance style={{ marginRight: "5px" }} /> 
                FAD
              </>
          }
        </span>
      </article>
      <article className='disponiblite-formateur-salle'>
        <div className="disponiblite-formateur">
        <h6 style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span>Salles Disponibles</span>

        <FaTimes style={{color:"red"}}  onClick={() =>{ 
           setDataSendToServer((prev) => ({
            ...prev,
            idSalle:null
          }));
          setSalleSelect(null)}} />
    </h6>          <ul className='disponiblite-formateur-ul'>
            {
              isLoadingSalleGet ? [1, 2, 3, 4, 5, 6].map((_, index) => (
                <Skeleton
                  baseColor='#f7f7f7'
                  highlightColor='#ebebeb'
                  style={{ margin: "5px 0", width: "100%", height: "35px" }}
                  key={index}
                />
              )) : 
              salles?.map((salle, index) => (
                <li
                  onClick={() => {
                    setSalleSelect(index);
                    onHandleSalle(salle.id, salle.MREST);
                  }}
                  className={salleSelect === index ? "elementHoverBackgroundSalleSelect" : ""}
                  key={index}
                >
                  <span>{salle.nom}</span>
                  <Tag color={salle.MREST > 25 ? 'geekblue' : 'green'} key={index}>
                    {salle.MREST}
                  </Tag>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="disponiblite-salle">
          <h6>Formateurs Disponibles</h6>
          {
              isLoadingSalleGet ? [1, 2, 3, 4, 5, 6].map((_, index) => (
                <Skeleton
                  baseColor='#f7f7f7'
                  highlightColor='#ebebeb'
                  style={{ margin: "5px 0", width: "100%", height: "35px" }}
                  key={index}
                />
              )) :  <Menu
      mode="inline"
      defaultSelectedKeys={['231']}
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      className='overflowYNav'
      onSelect={handleSelect}
      style={{
        width: 256,
        overflowY: "scroll",
        height: "calc(100% - 20px)",
      }}
      items={formateurDisponible}
    />
            }
          
        </div>
      </article>
    </div>
  );
}
