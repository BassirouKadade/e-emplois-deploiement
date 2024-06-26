import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd'; // Import des composants de la bibliothèque Ant Design
import { useQuery } from 'react-query'; // Import du hook useQuery pour les requêtes de données asynchrones
import Skeleton from 'react-loading-skeleton'; // Import du composant Skeleton pour l'affichage de chargement
import { BankOutlined } from '@ant-design/icons'; // Import de l'icône BankOutlined de Ant Design
import { getEmploisSalle } from '../../request/createEmploisRequest/createEmploisRequest';
import { allSallesDatabase } from '../../request/salleRequest/salleRequest';
import useStore from '../../store/useStore';
// Définition du composant SallesVerification
const SallesVerification = ({ handleClickCloseSalle,setDataEmploisFormateur, setDataSemploisSalle }) => {

  const toggleCurrentSalleImpression=useStore(state=>state.toggleCurrentSalleImpression)
  // Utilisation du hook useQuery pour récupérer toutes les salles de la base de données
  const { data, isLoading } = useQuery(['get-All-Sale-database'], async () => {
    try {
      const response = await allSallesDatabase(); // Appel de la fonction pour récupérer les salles
      return response.data; // Retourne les données des salles
    } catch (error) {
      console.error(error); // Affiche une erreur en cas d'échec de la requête
      throw error;
    }
  });

  // Utilisation du hook useState pour gérer l'état de l'ID de salle sélectionnée
  const [idSalleSelect, setSalleSelect] = useState(null);

  // Utilisation du hook useQuery pour récupérer les emplois de la salle sélectionnée
  const { data: getEmploisData, isLoading: isLoadingDataEmploisSalle } = useQuery(['get-Emplois-salle', idSalleSelect], async () => {
    try {
      const response = await getEmploisSalle(idSalleSelect); // Appel de la fonction pour récupérer les emplois de la salle sélectionnée
      setDataSemploisSalle(prev => ({ ...prev, loading: false })); // Met à jour l'état des emplois de salle
      return response.data; // Retourne les données des emplois de salle
    } catch (error) {
      console.error(error); // Affiche une erreur en cas d'échec de la requête
      throw error;
    }
  }, {
    enabled: !!idSalleSelect // Active la requête uniquement si l'ID de la salle est sélectionné
  });

  // Définition des colonnes de la table
  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => <a>{text}</a>, // Rendu du texte avec un lien
    },
    {
      title: 'Capacité',
      dataIndex: 'capacite',
      key: 'capacite',
    },
    {
      title: 'MH',
      dataIndex: 'MH',
      key: 'MH',
    },
    {
      title: 'MREST',
      key: 'MREST',
      dataIndex: 'MREST',
      render: (MREST) => (
        <Tag color={MREST > 5 ? 'geekblue' : 'green'} key={MREST}>
          {MREST}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'id',
      key: 'MH',
      render: (id) => (
        <Tag  style={{cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} color={id > 20 ? 'geekblue' : 'green'} key={id} onClick={() => { setDataEmploisFormateur(prev=> ({...prev,selectedFormateur:false}));
        handleClickCloseSalle(); 
        toggleCurrentSalleImpression(id)
        setSalleSelect(id) }}>
            <BankOutlined style={{ marginRight: "5px" }} /> Occupations de salle
        </Tag>
      ),
    },
  ];

  // Effet pour mettre à jour les données des emplois de salle une fois qu'elles sont récupérées
  useEffect(() => {
    if (!isLoadingDataEmploisSalle && getEmploisData) {
      setDataSemploisSalle(prev => ({ ...prev, data: getEmploisData }));
    } else {
      setDataSemploisSalle(prev => ({ ...prev, loading: isLoadingDataEmploisSalle }));
    }
  }, [isLoadingDataEmploisSalle, getEmploisData]);

  // Effet pour mettre à jour l'état de la salle sélectionnée
  useEffect(() => {
    if (idSalleSelect) {
      setDataSemploisSalle(prev => ({ ...prev, selectedSalle: true }));
    }
  }, [idSalleSelect]);

  // Rendu conditionnel du composant Skeleton lors du chargement, sinon affiche la table de données
  return (
    isLoading || !data ? <div style={{ padding: "13px", width: "600px" }}>
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <Skeleton
          baseColor='#f7f7f7'
          highlightColor='#ebebeb'
          style={{ margin: "5px 0", width: "100%", height: "35px" }}
          key={index}
        />
      ))}
    </div> : <Table
      style={{ width: "600px" }}
      className="custom-pagination" // Applique la classe CSS personnalisée
      columns={columns}
      dataSource={data}
      pagination={{
        position: ['bottomLeft'],
        pageSize: 5, // Limite à 5 éléments par page
      }}
    />
  );
};

export default SallesVerification;






