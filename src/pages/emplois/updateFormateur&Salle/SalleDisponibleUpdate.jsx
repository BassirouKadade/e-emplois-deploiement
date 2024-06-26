import React, { useEffect, useState } from 'react';
import { Tag, notification } from 'antd';
import Skeleton from 'react-loading-skeleton';
import { useQueryClient, useMutation } from 'react-query';
import { GrUpdate } from "react-icons/gr";
import Progress from '../../../components/Progess';
import { emploisupdateSaleValid } from '../../../request/createEmploisRequest/createEmploisRequest';
import '../../../styles/emplois/Disponibilte.css';
import { MdOutlineSocialDistance } from "react-icons/md";

export default function SalleDisponibleUpdate({ emploisIdUpdateSalle, setEmploisData, handleCloseSalle, isLadingSallesDound, SallesFound }) {
    // État pour la salle sélectionnée
    const [salleSelect, setSalleSelect] = useState(null);

    // État pour les données à envoyer au serveur
    const [dataSendToServer, setDataSendToServer] = useState({dureeSalle:null, idSalle: null, idReservation: null });

    // État pour les erreurs de validation
    const [error, setError] = useState({dureeSalle:false, salle: false });

    // État pour les erreurs du serveur
    const [errorServer, setErrorServer] = useState({});
    
    // Client de requêtes pour l'invalidation des requêtes après mise à jour
    const queryClient = useQueryClient();
    const [api, contextHolder] = notification.useNotification();

    // Mutation pour envoyer les données de mise à jour au serveur
    const { mutate, isLoading } = useMutation(async (data) => {
        try {
            const response = await emploisupdateSaleValid(data);
            return response;
        } catch (error) {
            setErrorServer(error.response?.data || 'Une erreur est survenue');
            throw error;
        }
    }, {
        onSuccess: (data) => {
            handleCloseSalle();
            if (data?.data) {
                setEmploisData(data?.data);
            }
            // Invalidation des requêtes pour rafraîchir les données
            queryClient.invalidateQueries('get-totale-seance-groupe');
            queryClient.invalidateQueries('get-emplois-groupe');
            queryClient.invalidateQueries('get-Emplois-salle');
            queryClient.invalidateQueries('get-Module-Filiere-groupe');
            queryClient.invalidateQueries('verification_salle_disponible_update');
        },
    });

    // Mise à jour de l'ID de réservation lorsque emploisIdUpdateSalle change
    useEffect(() => {
        setDataSendToServer((prev) => ({
            ...prev,
            idReservation: emploisIdUpdateSalle
        }));
    }, [emploisIdUpdateSalle]);

    // Fonction pour gérer la sélection de la salle
    const onHandleSalle = (id) => {
        setDataSendToServer((prev) => ({ ...prev, idSalle: id }));
    };

    // Fonction pour envoyer les données au serveur

    const [tyForm,setTypeForm]=useState(null)

    const onHandleSendDataTOServer = (typeFormateur=null) => {
        if (!dataSendToServer.idSalle && !typeFormateur) {
            setError(prev => ({ ...prev, salle: true }));
            return;
        }
        if ((dataSendToServer.dureeSalle  < SallesFound?.nombeHeureSeance) && !typeFormateur) {
            setError(prev => ({ ...prev, dureeSalle: true }));
            return;
        }

        if(!typeFormateur){
            setDataSendToServer(prev=>({...prev,idSalle:null}))
            setSalleSelect(null)
        }


        
        setTypeForm(typeFormateur)
        dataSendToServer.typeFormation=typeFormateur
        mutate(dataSendToServer);
    };

    // Notification pour salle non définie
    const openNotificationRoomNotDefined = () => {
        api.error({
            message: 'Alerte Salle Non Définie',
            description: "Veuillez sélectionner une salle pour pouvoir mettre à jour la séance.",
        });
    };
    const openNotificationRoomNotDureeSalleInsf = () => {
        api.error({
            message: 'Durée insuffisante',
            description: "Veuillez choisir une autre salle car la durée de la salle actuelle est insuffisante.",
        });
    };
    
    
    // Affichage de la notification d'erreur si nécessaire
    useEffect(() => {
        if (error?.salle) {
            openNotificationRoomNotDefined();
        }
        if (error?.dureeSalle) {
            openNotificationRoomNotDureeSalleInsf();
        }

        
    }, [error]);

    return (
        <div className='disponiblite-data'>
            {contextHolder}
            <article className="type-cours">
                <span onClick={()=>onHandleSendDataTOServer()} className='type type-PRE'>
                    {isLoading  && tyForm==null? <Progress w={"25px"} h={"25px"} color={'white'} /> : <>
                        <GrUpdate style={{ fontSize: "14px", margin: "0 5px" }} /> 
                        Mettre à jour
                    </>}
                </span>
                <span onClick={()=>onHandleSendDataTOServer("FAD")} className='type type-FAD'>
                    {isLoading && tyForm==="FAD" ? <Progress w={"25px"} h={"25px"} color={'white'} /> : <>
                    <MdOutlineSocialDistance style={{ marginRight: "5px" }} /> 
                        FAD
                    </>}
                </span>

            </article>
            <article className='disponiblite-formateur-salle'>
                <div style={{ width: "100%" }} className="disponiblite-formateur">
                    <h6 style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>Salles Disponibles</span>
                    </h6>
                    <ul className='disponiblite-formateur-ul'>
                        {isLadingSallesDound ? 
                            [1, 2, 3, 4, 5, 6].map((_, index) => (
                                <Skeleton
                                    baseColor='#f7f7f7'
                                    highlightColor='#ebebeb'
                                    style={{ margin: "5px 0", width: "100%", height: "35px" }}
                                    key={index}
                                />
                            )) : 
                            SallesFound?.salles?.map((salle, index) => (
                                <li
                                    onClick={() => {
                                        setSalleSelect(index);
                                        setDataSendToServer(prev=>({...prev,dureeSalle:salle.MREST}))
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
            </article>
        </div>
    );
}
