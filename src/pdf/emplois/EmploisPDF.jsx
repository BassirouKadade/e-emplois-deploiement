import React, { useEffect, useState } from 'react';
import {  pdf } from '@react-pdf/renderer';
import { useQuery } from 'react-query';
import MyDocument from './MyDocument';
import useStore from '../../store/useStore';
import { useQueryClient } from 'react-query';
import { getEmploisFormateurPrime } from '../../request/createEmploisRequest/createEmploisRequest';
import { getEmploisGroupePrime } from '../../request/createEmploisRequest/createEmploisRequest';
import { getEmploisSallePrime } from '../../request/createEmploisRequest/createEmploisRequest';
import { getEmploisAllOFDATABASE } from '../../request/createEmploisRequest/createEmploisRequest';
import MyDocumentAll from './MyDocumentAll';
const currentYear = new Date().getFullYear();
export default function EmploisPDF() {
  const currentIDSelected = useStore(state => state.currentIDSelected);
  const toggleChargement = useStore(state => state.toggleChargement);
  const [emploisData, setEmploisData] = useState(null);
  const [dataHeader, setDataHeader] = useState({});
  const toggleReset = useStore(state => state.toggleReset);
  const queryClient = useQueryClient();
  const currentElementToDownload=useStore(state => state.currentElementToDownload);
const toggleResetToogleSerachAllPDF=useStore(state => state.toggleResetToogleSerachAllPDF);
  const [typeElementPDF,setTypeElementPDF]=useState(null)

  useEffect(() => {
         var valeur=null
         if(currentIDSelected.typeElement==="groupe"){
              valeur=dataHeader?.groupe
         }
         else if(currentIDSelected.typeElement==="formateur"){
               valeur=dataHeader?.nom
         }else{
            valeur=dataHeader?.salle;   
          }
         setTypeElementPDF(valeur)
  }, [dataHeader])

 
const downloadPdf = async () => {
  if (!currentIDSelected.typeElement) {
      return;
  }
  try {
      const blob = await pdf(<MyDocument typeElement={currentIDSelected.typeElement} dataHeader={dataHeader} emploisData={emploisData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Emplois_du_temps_du_${currentIDSelected.typeElement}_${typeElementPDF}_${currentYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  } catch (error) {
      console.error('Failed to download PDF:', error);
  } finally {
      setTimeout(() => {
          toggleReset();
      }, 300);
  }
};

const { data: getEmplois, isLoading: loadingGetEmplois } = useQuery(
  ['get-emplois-groupe-convert-to-pdf', currentIDSelected.id],
  async () => {
      if (!currentIDSelected.id) {
          throw new Error("L'ID du groupe n'est pas disponible");
      }
      try {
          const response = await getEmploisGroupePrime(currentIDSelected.id);
          setTypeElementPDF(response.data.dataHeader.groupe);
          return response.data;
      } catch (error) {
          console.error(error);
          throw error;
      }
  },
  {
      enabled: !!currentIDSelected?.id && currentIDSelected.typeElement === "groupe",
      onSuccess: () => {
          queryClient.invalidateQueries(['get-emplois-groupe-convert-to-pdf', currentIDSelected?.id]);
      },
  }
);

useEffect(() => {
  if (!loadingGetEmplois && getEmplois) {
      setTimeout(() => {
          toggleChargement(false);
      }, 100);
      setEmploisData({
          "Lundi": getEmplois?.reservations?.filter(element => element.day === "Lundi"),
          "Mardi": getEmplois?.reservations?.filter(element => element.day === "Mardi"),
          "Mercredi": getEmplois?.reservations?.filter(element => element.day === "Mercredi"),
          "Jeudi": getEmplois?.reservations?.filter(element => element.day === "Jeudi"),
          "Vendredi": getEmplois?.reservations?.filter(element => element.day === "Vendredi"),
          "Samedi": getEmplois?.reservations?.filter(element => element.day === "Samedi")
      });
      setDataHeader(getEmplois?.dataHeader);
  } else {
      toggleChargement(loadingGetEmplois);
  }
}, [loadingGetEmplois, getEmplois, toggleChargement]);

useEffect(() => {
  if (emploisData && !loadingGetEmplois) {
      downloadPdf();
  }
}, [emploisData, loadingGetEmplois]);

//  ************************************************
//  Get emplois formateur 

const { data: getEmploisSalle, isLoading: loadingGetEmploisSalle } = useQuery(
  ['get-emplois-salle-convert-to-pdf', currentIDSelected.id],
  async () => {
    if (!currentIDSelected.id) {
      throw new Error("L'ID du salle n'est pas disponible");
    }
    try {
      const response = await getEmploisSallePrime(currentIDSelected.id);
      setTypeElementPDF(response.data.dataHeader.salle)
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  {
    enabled: !!currentIDSelected?.id && currentIDSelected.typeElement === "salle",
    onSuccess: () => {
      queryClient.invalidateQueries(['get-emplois-salle-convert-to-pdf', currentIDSelected?.id]);
    },
  }
);

useEffect(() => {
  if (!loadingGetEmploisSalle && getEmploisSalle) {
    setTimeout(() => {
      toggleChargement(false);
    }, 1000);
    setEmploisData({
      "Lundi": getEmploisSalle?.reservations?.filter(element => element.day === "Lundi"),
      "Mardi": getEmploisSalle?.reservations?.filter(element => element.day === "Mardi"),
      "Mercredi": getEmploisSalle?.reservations?.filter(element => element.day === "Mercredi"),
      "Jeudi": getEmploisSalle?.reservations?.filter(element => element.day === "Jeudi"),
      "Vendredi": getEmploisSalle?.reservations?.filter(element => element.day === "Vendredi"),
      "Samedi": getEmploisSalle?.reservations?.filter(element => element.day === "Samedi")
    });
    setDataHeader(getEmploisSalle?.dataHeader);
  } else {
    toggleChargement(loadingGetEmploisSalle);
  }
}, [loadingGetEmploisSalle, getEmploisSalle, toggleChargement]);


useEffect(() => {
  if (getEmploisSalle && !loadingGetEmploisSalle) {
    downloadPdf();
  }
}, [getEmploisSalle, loadingGetEmploisSalle]);



//  ************************************************
//  Get emplois Formateur 

const { data: getEmploisFormateur, isLoading: loadingGetEmploiFOrmateur } = useQuery(
  ['get-emplois-formateur-convert-to-pdf', currentIDSelected.id],
  async () => {
    if (!currentIDSelected.id) {
      throw new Error("L'ID du formateur n'est pas disponible");
    }
    try {
      const response = await getEmploisFormateurPrime(currentIDSelected.id);
      setTypeElementPDF(response.data.dataHeader.nom)
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  {
    enabled: !!currentIDSelected?.id && currentIDSelected.typeElement === "formateur",
    onSuccess: () => {
      queryClient.invalidateQueries(['get-emplois-formateur-convert-to-pdf', currentIDSelected?.id]);
    },
  }
);

useEffect(() => {
  if (!loadingGetEmploiFOrmateur && getEmploisFormateur) {
    setTimeout(() => {
      toggleChargement(false);
    },1000);
    setEmploisData({
      "Lundi": getEmploisFormateur?.reservations?.filter(element => element.day === "Lundi"),
      "Mardi": getEmploisFormateur?.reservations?.filter(element => element.day === "Mardi"),
      "Mercredi": getEmploisFormateur?.reservations?.filter(element => element.day === "Mercredi"),
      "Jeudi": getEmploisFormateur?.reservations?.filter(element => element.day === "Jeudi"),
      "Vendredi": getEmploisFormateur?.reservations?.filter(element => element.day === "Vendredi"),
      "Samedi": getEmploisFormateur?.reservations?.filter(element => element.day === "Samedi")
    });
    setDataHeader(getEmploisFormateur?.dataHeader);
  } else {
    toggleChargement(loadingGetEmploiFOrmateur);
  }
}, [loadingGetEmploiFOrmateur, getEmploisFormateur, toggleChargement]);


useEffect(() => {
  if (getEmploisFormateur && !loadingGetEmploiFOrmateur) {
    downloadPdf();
  }
}, [getEmploisFormateur, loadingGetEmploiFOrmateur]);



// *****************************************************
// **************
// *************---------------
// GESTION DE TELECHEGREMENT D'EMPLOIS DU TEPS D E FORMATEUR N?SALLE ET GROUPE


const downloadPdfAll = async (typeElement, emploisData, filename) => {
  if (!typeElement) {
    console.error('Type d\'élément non spécifié.');
    return;
  }

  try {
    const blob = await pdf(<MyDocumentAll
      typeElement={typeElement}
      emploisData={emploisData}
    />).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `document.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Réinitialisation après téléchargement réussi
    setTimeout(() => {
      toggleResetToogleSerachAllPDF();
    }, 300);
  } catch (error) {
    console.error('Échec du téléchargement du PDF :', error);
  }
};



const { data: getEmploisAll, isLoading: isLoadingGetEmploisAll } = useQuery(
  ['get-emplois-all-convert-to-pdf'],
  async () => {
    try {
      const response = await getEmploisAllOFDATABASE();
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  {
    enabled: ['TF', 'TS', 'TG'].includes(currentElementToDownload?.typeElement),
    onSuccess: () => {
      queryClient.invalidateQueries(['get-emplois-all-convertget-to-pdf']);
    },
  }
);

useEffect(() => {
  if (!isLoadingGetEmploisAll && !!getEmploisAll) {
    setTimeout(() => {
      toggleChargement(false);
    }, 1000);

    if (currentElementToDownload?.typeElement === "TG") {
      const groupeUnique = Array.from(new Set(getEmploisAll?.map(state => state.groupe?.code)));
      
      const groupeEmplois = groupeUnique.map(groupe => ({
        [groupe]: {
          "Lundi": getEmploisAll.filter(element => element.groupe?.code === groupe && element.day === "Lundi"),
          "Mardi": getEmploisAll.filter(element => element.groupe?.code === groupe && element.day === "Mardi"),
          "Mercredi": getEmploisAll.filter(element => element.groupe?.code === groupe && element.day === "Mercredi"),
          "Jeudi": getEmploisAll.filter(element => element.groupe?.code === groupe && element.day === "Jeudi"),
          "Vendredi": getEmploisAll.filter(element => element.groupe?.code === groupe && element.day === "Vendredi"),
          "Samedi": getEmploisAll.filter(element => element.groupe?.code === groupe && element.day === "Samedi"),
        }
      }));

      setEmploisData(groupeEmplois)
    }else if (currentElementToDownload?.typeElement === "TF") {
      const  formateurUnique = Array.from(new Set(getEmploisAll?.map(state => state.formateur?.id)));
      
      const formateurEmplois = formateurUnique?.map(formateur => ({
        [formateur]: {
          "Lundi": getEmploisAll.filter(element => element.formateur?.id === formateur && element.day === "Lundi"),
          "Mardi": getEmploisAll.filter(element => element.formateur?.id === formateur && element.day === "Mardi"),
          "Mercredi": getEmploisAll.filter(element => element.formateur?.id === formateur && element.day === "Mercredi"),
          "Jeudi": getEmploisAll.filter(element => element.formateur?.id=== formateur && element.day === "Jeudi"),
          "Vendredi": getEmploisAll.filter(element => element.formateur?.id === formateur && element.day === "Vendredi"),
          "Samedi": getEmploisAll.filter(element => element.formateur?.id === formateur && element.day === "Samedi"),
        }
      }));
      setEmploisData(formateurEmplois)
    }else if(currentElementToDownload?.typeElement === "TS"){
       const salleNotNull=getEmploisAll.filter(emplois=>emplois.salle!==null);
      const  salleUnique = Array.from(new Set(salleNotNull.map(state => state.salle.id)));
      const salleEmplois = salleUnique.map(salle => ({
        [salle]: {
          "Lundi": salleNotNull.filter(element => element.salle?.id === salle && element.day === "Lundi"),
          "Mardi": salleNotNull.filter(element => element.salle?.id === salle && element.day === "Mardi"),
          "Mercredi": salleNotNull.filter(element => element.salle?.id === salle && element.day === "Mercredi"),
          "Jeudi": salleNotNull.filter(element => element.salle?.id === salle && element.day === "Jeudi"),
          "Vendredi": salleNotNull.filter(element => element.salle?.id === salle && element.day === "Vendredi"),
          "Samedi": salleNotNull.filter(element => element.salle?.id === salle && element.day === "Samedi"),
        }
      }));
      setEmploisData(salleEmplois)
    }
  } else {
      toggleChargement(isLoadingGetEmploisAll);
  }
}, [isLoadingGetEmploisAll, getEmploisAll, currentElementToDownload]);

useEffect(() => {
  const fetchDataAndDownloadPdf = async () => {
    if (getEmploisAll && !isLoadingGetEmploisAll) {
      var typeElementTodownloadPDF=null;
      if (currentElementToDownload?.typeElement === "TG") {
        typeElementTodownloadPDF="groupe";
      }
      else if(currentElementToDownload?.typeElement === "TF"){
        typeElementTodownloadPDF="formateur"
      }
      else if(currentElementToDownload?.typeElement === "TS"){
        typeElementTodownloadPDF="salle";
      }
      await downloadPdfAll(typeElementTodownloadPDF, emploisData, `Emplois_du_temps_des_${typeElementTodownloadPDF}s.pdf`);
    }
  };

  fetchDataAndDownloadPdf();

}, [getEmploisAll, isLoadingGetEmploisAll, emploisData]);

  return null;
}
