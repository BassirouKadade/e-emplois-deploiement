import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import logo from '../../assets/Logoemp.png';
import styles from './style';
import backgroundImage from '../../assets/emplois4.png';

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

function masseHoraire(groupeEmploi) {
  const firstKey = Object.keys(groupeEmploi)[0];
  let masseHoraireTotale = 0;

  if (groupeEmploi[firstKey]) {
    Object.keys(groupeEmploi[firstKey]).forEach((day) => {
      groupeEmploi[firstKey][day].forEach((seance) => {
        masseHoraireTotale += seance.nombeHeureSeance;
      });
    });
  }

  return masseHoraireTotale;
}

function infoGroupe(groupeEmploi) {
  const firstKey = Object.keys(groupeEmploi)[0];

  if (groupeEmploi[firstKey]) {
    const dayKey = Object.keys(groupeEmploi[firstKey]).find(day => groupeEmploi[firstKey][day].length > 0);
    if (dayKey) {
      const seance = groupeEmploi[firstKey][dayKey][0];
      return {
        filiere: seance.groupe.filiere,
        groupe: seance.groupe,
      };
    }
  }
  return {};
}

function infos(groupeEmploi) {
  const firstKey = Object.keys(groupeEmploi)[0];

  if (groupeEmploi[firstKey]) {
    const dayKey = Object.keys(groupeEmploi[firstKey]).find(day => groupeEmploi[firstKey][day].length > 0);
    if (dayKey) {
      const seance = groupeEmploi[firstKey][dayKey][0];
      return {
        formateur: seance.formateur,
        salle: seance.salle,
      };
    }
  }
  return {};
}

const MyDocumentAll = ({ typeElement, emploisData }) => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <Document>
      {emploisData.map((groupeEmploi, groupeIndex) => (
        <Page key={groupeIndex} size="A4" orientation="landscape" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Image style={styles.logo} src={logo} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Emplois du temps par groupe</Text>
              <Text style={styles.subTitle}>Au titre de l'année {currentYear - 1} - {currentYear}</Text>
            </View>
          </View>
          {
            typeElement === "groupe" &&
            <View style={styles.header1}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>DRCS/CFP-BB/ISTA-BOUZNIKA</Text>
                <Text style={styles.infoText}>Filière: {infoGroupe(groupeEmploi)?.filiere?.code} / {infoGroupe(groupeEmploi)?.filiere?.niveau === 1 ? "1ère" : "2ème"} Année</Text>
                <Text style={styles.infoText}>Niveau : TS</Text>
                <Text style={styles.infoText}>Masse Horaire : {masseHoraire(groupeEmploi)} heures</Text>
              </View>
              <View style={styles.infoContainer1}>
                <Text style={styles.infoText}>Groupe: {infoGroupe(groupeEmploi)?.groupe?.code}</Text>
                <Text style={styles.infoText}>Année de formation : {currentYear}</Text>
                <Text style={styles.infoText}>Période d'application : {currentDate}</Text>
              </View>
            </View>
          }
          {
            typeElement === "formateur" &&
            <View style={styles.header1}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>DRCS/CFP-BB/ISTA-BOUZNIKA</Text>
                <Text style={styles.infoText}>Matricule : {infos(groupeEmploi)?.formateur?.matricule}</Text>
                <Text style={styles.infoText}>Nom : {infos(groupeEmploi)?.formateur?.nom}</Text>
                <Text style={styles.infoText}>Prénom : {infos(groupeEmploi)?.formateur?.prenom}</Text>
              </View>
            </View>
          }
          {
            typeElement === "salle" &&
            <View style={styles.header1}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>DRCS/CFP-BB/ISTA-BOUZNIKA</Text>
                <Text style={styles.infoText}>Salle : {infos(groupeEmploi)?.salle?.nom}</Text>
                <Text style={styles.infoText}>Capacité : {infos(groupeEmploi)?.salle?.capacite}</Text>
                <Text style={styles.infoText}>Masse horaire de salle : {infos(groupeEmploi)?.salle?.MH}</Text>
              </View>
            </View>
          }

          <View style={styles.body}>
            {/* Day and Hour Headers */}
            <View style={styles.sectionOne}>
              <View style={styles.jours}>
                <Text style={styles.joursText}>J/H</Text>
              </View>
              <View style={styles.heures}>
                {hours.map((hour, index) => (
                  <Text key={index} style={{
                    color: "#000",
                    textAlign: "center",
                    borderLeft: index % 2 !== 0 ? "1px dashed #000" : "1px solid #000",
                    flex: 1,
                    height: "100%",
                    padding: "15px 0",
                    fontSize: "11px",
                  }}>{hour}</Text>
                ))}
              </View>
            </View>

            {/* Schedule Grid */}
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.sheduleLeft}>
                {days.map((day, dayIndex) => (
                  <View key={dayIndex} style={styles.row}>
                    <Text style={styles.dayCell}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Right Side - Schedule */}
              <View style={styles.sheduleRight}>
                <Image src={backgroundImage} />
                {Object.keys(groupeEmploi[Object.keys(groupeEmploi)[0]]).map((day) => (
                  <React.Fragment key={day}>
                    {groupeEmploi[Object.keys(groupeEmploi)[0]][day].map((emploi, index) => (
                      <View
                        style={{
                          position: 'absolute',
                          top: `${emploi.startTop}%`,
                          left: `${emploi.startIndex}%`,
                          width: reductionCeil(emploi.width),
                          height: "41px",
                          backgroundColor: emploi.typeReservation === "FAD" ? "#d3d3d3" : "#ffffff",
                          borderLeftWidth: 0.3,
                          borderRightWidth: 1,
                          borderColor: 'black',
                          borderStyle: 'solid',
                          textAlign: 'center',
                          fontSize: '13px',
                          padding: '5px'
                        }}
                        key={index}
                      >
                        <Text style={{ fontSize: "11px", textTransform: "capitalize" }}>
                          {typeElement === "salle" && `${emploi.formateur.nom} ${emploi.formateur.prenom}`}
                          {typeElement === "formateur" && emploi.groupe.code}
                          {typeElement === "groupe" && `${emploi.formateur.nom} ${emploi.formateur.prenom}`}
                        </Text>
                        {emploi.typeReservation === "FP" ? (
                          <View style={{ fontSize: "9px", textTransform: "capitalize" }}>
                            <Text style={{ margin: "2px 0" }}>
                              {typeElement === "salle" && emploi.groupe.code}
                              {typeElement === "formateur" && emploi.module.description}
                              {typeElement === "groupe" && emploi.module.description}
                            </Text>
                            <Text>
                              {typeElement === "salle" && emploi.module.description}
                              {typeElement === "formateur" && emploi.salle.nom}
                              {typeElement === "groupe" && emploi.salle.nom}
                            </Text>
                          </View>
                        ) : (
                          <View style={{ fontSize: "9px", textTransform: "capitalize" }}>
                            <Text style={{ margin: "2px 0" }}>{emploi.module.description}</Text>
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

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Directeur du site</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default MyDocumentAll;
