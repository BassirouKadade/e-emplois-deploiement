// styles.js
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  text: {
    marginBottom: "10px",
    fontSize: 19,
    textAlign: "center",
    fontWeight: 500,
    color: "#00000",
  },
  textMedium: {
    marginBottom: "16px",
    fontSize: 12,
    textAlign: "center",
    fontWeight: 500,
    color: "#00000",
  },
  page: {
    fontSize: 12,
    padding: 25,
    flexDirection: "column",
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(244, 246, 248)",
    padding: "8 6px ",
    borderBottom: "1px dashed rgb(241, 243, 244)",
  },
  row: {
    borderTop: "1px solid #EEE",
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "0.5px solid #000000",
    padding: "4px ",
  },
  description: {
    width: "60%",
  },
  xyz: {
    width: "40%",
    // border:"1px solid red"
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
  logo: {
    width: 50,
    height: 50,
  },
});

export default styles;
