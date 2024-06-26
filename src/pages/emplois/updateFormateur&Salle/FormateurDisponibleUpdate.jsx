import React, { useEffect, useState } from 'react';
import { Menu, notification } from 'antd';
import { IoIosHome } from "react-icons/io";
import '../../../styles/emplois/Disponibilte.css'
import Skeleton from 'react-loading-skeleton';
import { useQueryClient, useMutation } from 'react-query';
import Progress from '../../../components/Progess';
import { UserOutlined } from '@ant-design/icons';
import { updateEmploisFormateurChampValid } from '../../../request/createEmploisRequest/createEmploisRequest';
import { GrUpdate } from "react-icons/gr";

// Composant principal
export default function  FormateurDisponibleUpdate({ emploisIdUpdate, dataFind,handleCloseFormateur, setEmploisData, isLoadingDataFind }) {
  const [dataSendToServer, setDataSendToServer] = useState({
    idFormateur:null,
    idModule:null,
    idReservation:null,
  });

  const [error, setError] = useState({module:false, formateur: false, }); // État pour les erreurs


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
   
//   const  [dataToSend,setDataToSend]=useState()
  const { mutate, isLoading } = useMutation(async (data) => {
    try {
      const response = await updateEmploisFormateurChampValid(data);
      return response;
    } catch (error) {
      setErrorServer(error.response?.data || 'An error occurred');
      throw error;
    }
  }, {
    onSuccess: (data) => {
      handleCloseFormateur();
      if(data?.data){
        setEmploisData(data?.data)
      }
      queryClient.invalidateQueries('get-totale-seance-groupe');
      queryClient.invalidateQueries('get-emplois-groupe');
      queryClient.invalidateQueries('get-Emplois-salle');
      queryClient.invalidateQueries('get-Module-Filiere-groupe');
      queryClient.invalidateQueries('verification_formateur_disponible_update');
    },
  });


  
// Déclaration des états pour stocker les formateurs disponibles, l'ID du formateur sélectionné et la clé de l'enfant sélectionné
const [formateurDisponible, setFormateurDisponible] = useState([]);
const [idFormateur, setIdFormateur] = useState(null);
const [selectedChildKey, setSelectedChildKey] = useState(null);

// useEffect pour mettre à jour la liste des formateurs disponibles lorsque les données des formateurs ou l'état de chargement changent
useEffect(() => {
  if (!isLoadingDataFind && dataFind?.formateurs) {
    // Mappage des formateurs pour créer une structure de données avec clés, icônes et libellés
    const listeMap = dataFind?.formateurs.map((element) => {
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
}, [isLoadingDataFind, dataFind?.formateurs]);

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
      idModule:idModule,
      idFormateur:idFormateur,
      idReservation: emploisIdUpdate,
    }));
  }, [dataFind?.id, idFormateur,idModule]);



const levelKeys = getLevelKeys(formateurDisponible);


  // Gestion de l'envoi des données au serveur
  const onHandleSendDataTOServer = () => {

    if (!idFormateur ) {
      setError(prev => ({ ...prev, formateur: true }));
      return;
    }    
    if (!idModule ) {
        setError(prev => ({ ...prev, module: true }));
        return;
      }    
        mutate(dataSendToServer);
  };





  const [api, contextHolder] = notification.useNotification(); // Notification API

// Fonction pour ouvrir une notification lorsque le groupe n'est pas défini
const openNotificationFormateur = (type) => {
    api[type]({
      message: 'Alerte : Formateur Non Sélectionné',
      description: "Veuillez sélectionner un formateur avant de créer l'emploi du temps.",
    });
  };
  
  const openNotificationModule = (type) => {
    api[type]({
      message: 'Alerte : Module Non Sélectionné',
      description: "Veuillez sélectionner un module avant de créer l'emploi du temps.",
    });
  };
  
  // Gestion des notifications d'erreur
  useEffect(() => {
    if (error?.formateur) {
        openNotificationFormateur('error');
    }  
    
    if (error?.module) {
        openNotificationModule('error');
      }  
  }, [error]);


  return (
    <div className='disponiblite-data'>
      {contextHolder}
      <article  className="type-cours">
        <span onClick={() => {  onHandleSendDataTOServer() }} className='type type-PRE'>
          {
            isLoading  ? 
              <Progress w={"25px"} h={"25px"} color={'white'} /> : 
              <>
                <GrUpdate style={{fontSize:"14px", margin: "0 5px" }} /> 
                mettre à jour
              </>
          }
        </span>
      </article>
      <article  className='disponiblite-formateur-salle'>

        <div style={{width:"100%"}} className="disponiblite-salle">
          <h6>Formateurs Disponibles</h6>
          {
              isLoadingDataFind ? [1, 2, 3, 4, 5, 6].map((_, index) => (
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
        width: "103%",
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
