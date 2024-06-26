// TableRow.js
import React from "react";
import { View, Text } from "@react-pdf/renderer";
import styles from "./styles";

const TableRow = ({ items }) => {
  const rows = items.map((item,index) => (
    <View style={styles.row} key={index.toString()}>
      <Text style={styles.xyz}>{item?.matricule}</Text>
      <Text style={styles.xyz}>{item?.nom}</Text>
      <Text style={styles.xyz}>{item?.prenom}</Text>
      <Text style={styles.xyz}>{item?.metier}</Text>
    </View>
  ));
  return <>{rows}</>;
};

export default TableRow;
