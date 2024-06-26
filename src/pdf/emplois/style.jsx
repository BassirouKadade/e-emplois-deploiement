import {  StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: "16px 20px",
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 2,
      borderBottomColor: '#000',
    },
    header1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: "10px 0",
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    titleContainer: {
      flex: 1,
      marginLeft: 0,
      textAlign: 'center',
    },
    title: {
      fontSize: 24,
      color: "#000",
      fontWeight: "bold",
    },
    subTitle: {
      fontSize: 18,
      marginTop: 5,
      color: '#333333',
    },
    infoContainer: {
      flex: 1,
      textAlign: 'left',
    },
    infoContainer1: {
      flex: 1,
      marginLeft: 15,
      textAlign: 'right',
    },
    infoText: {
      fontSize: 12,
      marginBottom: 3,
      color: '#333333',
    },
    body: {
      position: "relative",
      // backgroundColor: "#FFF",
      height: "330px",
      width: "800px",
    },
    footer: {
      textAlign: 'right',
      marginTop: 10,
    },
    footerText: {
      fontSize: 12,
      margin: "1px 4px",
    },
    sectionOne: {
      display: "flex",
      alignItems: "center",
      flexDirection: 'row',
      backgroundColor: "#fff",
      color: "#fff",
      border:"1px solid #000",
    },
    jours: {
      backgroundColor: "#fff",
      width: "98px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    joursText: {
      color: "#000",
      fontSize: "15px",
      fontWeight: "bold",
    },
    heures: {
      width: 700,
      height:"100%",
      display: "flex",
      flexDirection: "row",
    },
    heuresText: {
      color: "#000",
      textAlign: "center",
      borderLeftWidth: 1,
      borderLeftColor: "#000",
      flex: 1,
      height:"100%",
      padding: "15px 0",
      fontSize: "11px",
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      height: "42px",
      borderBottomColor: '#000',
      backgroundColor: '#e6f2ff',
    },
    dayCell: {
      width: "100px",
      height: "100%",
      borderRightWidth: 1,
      borderLeftWidth:1,
      borderRightColor: '#000',
      borderLeftColor: '#000',
      padding: 5,
      paddingLeft: "5px",
      paddingTop: "10px",
      backgroundColor: '#fff',
      color: '#000',
    },
    sheduleLeft: {
      width: "100px",
      height: "100%",
      color: '#fff',
    },
    sheduleRight: {
      width: "700px",
      height: "252px",
      position: "relative",
    },
    textTest: {
      backgroundColor: "green",
      position: "absolute",
      left: 35,
      width:140,
      top: 51.66,
      height: "51.66px",
      color: "#ffffff"
    },
    backgroundImage:{
      position: "absolute",
      top:0,
      left:0
    }
  });

  export default styles
  
  



