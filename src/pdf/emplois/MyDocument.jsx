import React from 'react'
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import logo from '../../assets/Logoemp.png';
import styles from './style';
import backgroundImage from '../../assets/emplois4.png'

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const hours = [
  "08:30", "09:30", "09:30", "10:30", "10:30", "11:30", "11:30", "12:30",
  "12:30", "13:30", "13:30", "14:30", "14:30", "15:30", "15:30", "16:30",
  "16:30", "17:30", "17:30", "18:30"
];

const reductionCeil = (nombre) => {
  const divisionNombre = nombre / 45;
  const arrondi = Math.ceil(divisionNombre);
  const nombreFinal = arrondi * 10;
  return nombre - nombreFinal;
};

const currentYear = new Date().getFullYear();
const currentDate = new Date().toLocaleDateString();

const MyDocument = ({dataHeader,typeElement, emploisData }) => {
  const hasOneNotEmpty = Object.values(emploisData)?.some(array => array?.length > 0);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Emplois du temps de la section</Text>
            <Text style={styles.subTitle}>Au titre de l'année {currentYear - 1} - {currentYear}</Text>
          </View>
        </View>
           {
            typeElement==="groupe"&&
            <View style={styles.header1}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>DRCS/CFP-BB/ISTA-BOUZNIKA</Text>
                <Text style={styles.infoText}>Filière: {dataHeader?.filiere}/ {dataHeader?.niveau==1?"1 ere":"2 eme"} Année</Text>
                <Text style={styles.infoText}>Niveau : TS</Text>
                <Text style={styles.infoText}>Masse Horaire : {dataHeader?.masseHoraire} heures</Text>
              </View>
              <View style={styles.infoContainer1}>
                <Text style={styles.infoText}>Groupe: {dataHeader?.groupe}</Text>
                <Text style={styles.infoText}>Année de formation : {currentYear}</Text>
                <Text style={styles.infoText}>Période d'application : {currentDate}</Text>
              </View>
            </View>}
            {
            typeElement==="formateur"&&     
            <View style={styles.header1}>
                  <View style={styles.infoContainer}>
          <Text style={styles.infoText}>DRCS/CFP-BB/ISTA-BOUZNIKA</Text>
          <Text style={styles.infoText}>Matricule :  {dataHeader?.matricule}</Text>
          <Text style={styles.infoText}>Nom : {dataHeader?.nom}</Text>
          <Text style={styles.infoText}>Prénom  : {dataHeader?.prenom}</Text>
          </View>
        </View>
           }
            {
            typeElement==="salle"&&     
            <View style={styles.header1}>
                <View style={styles.infoContainer}>
          <Text style={styles.infoText}>DRCS/CFP-BB/ISTA-BOUZNIKA</Text>
          <Text style={styles.infoText}>Salle :  {dataHeader?.salle}</Text>
          <Text style={styles.infoText}>Capacité :  {dataHeader?.capacite}</Text>
          <Text style={styles.infoText}>Masse horaire de salle : {dataHeader?.masseHoraireSalle}</Text>
          <Text style={styles.infoText}>Masse Horaire reservée: {dataHeader?.masseHoraireOcuppe}</Text>
          </View>
        </View>
           }
      

        <View style={styles.body}>
          <View style={styles.sectionOne}>
            <View style={styles.jours}>
              <Text style={styles.joursText}>J/H</Text>
            </View>
            <View style={styles.heures}>
              {hours.map((hour, index) => (
                <Text key={index} style={{
                  color: "#000",
      textAlign: "center",
      borderLeft:index%2!==0?"1px dashed #000":"1px solid #000",
      flex: 1,
      height:"100%",
      padding: "15px 0",
      fontSize: "11px",
                }}>{hour}</Text>
              ))}
            </View>
          </View>
          <View style={{height:"252px", flexDirection: 'row' }}>
            <View style={styles.sheduleLeft}>
              {days.map((day, dayIndex) => (
                <View key={dayIndex} style={styles.row}>
                  <Text style={styles.dayCell}>{day}</Text>
                </View>
              ))}
            </View>
                   

            <View 
            style={styles.sheduleRight}>
                 <Image src={backgroundImage}  />
              {hasOneNotEmpty &&
                Object.keys(emploisData)?.map((day) => (
                  <React.Fragment key={day}>
                    {emploisData[day]?.map((emploi, index) => (
                      <View
                        style={{
                          position: 'absolute',
                          top: `${emploi.startTop}%`,
                          left: `${emploi.startIndex}%`,
                          width: reductionCeil(emploi.width),
                          height:"41px",
                          backgroundColor: emploi.typeReservation === "FAD" ? "#d3d3d3" : "#ffffff",
                        borderLeftWidth:0.3,
                          borderRightWidth:1,
                          borderColor: 'black',
                          borderStyle: 'solid',
                        textAlign: 'center',
                        fontSize: '13px',
                        padding: '5px'
                        
                        }}
                        key={index}
                      >
                        <Text style={{fontSize:"11px", textTransform: "capitalize" }}>
                          {
                            typeElement==="salle"&& emploi?.formateur?.nom } { typeElement==="salle"&&emploi?.formateur?.prenom
                          }
                           {
                            typeElement==="formateur"&& emploi?.groupe?.code
                          }
                           {
                            typeElement==="groupe"&& emploi?.formateur?.nom } { typeElement==="groupe"&&emploi?.formateur?.prenom
                          }
                        </Text>
                        {emploi.typeReservation === "FP" ? (
                          <View style={{fontSize:"9px", textTransform: "capitalize"}}>
                            <Text style={{margin:"2px 0"}}>
                            {
                            typeElement==="salle"&& emploi?.groupe?.code
                            }
                            {
                            typeElement==="formateur"&& emploi?.module.description
                            }
                            {
                            typeElement==="groupe"&& emploi?.module.description
                            }


                              </Text>
                            <Text>
                            {
                              typeElement==="salle"&&  emploi?.module.description
                            }
                             {
                              typeElement==="formateur"&&  emploi?.salle.nom
                            }
                             
                             {
                              typeElement==="groupe"&&  emploi?.salle.nom
                            }

                                </Text>
                          </View>
                        ) : (
                          <View style={{fontSize:"9px",textTransform: "capitalize"}}>
                            <Text style={{margin:"2px 0"}}>{emploi?.module?.description}</Text>
                            <Text>{emploi.typeReservation}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </React.Fragment>
                ))}
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Directeur du site</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;