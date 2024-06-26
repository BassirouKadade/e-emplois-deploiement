// ItemsTable.js
import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import Logo from "../../assets/Logoemp.png";
import TableRow from "./TableRow";
import styles from "./styles";

const ItemsTable = ({ data }) => {

  const  object=data?data[0]:[];
  const keys = Object.keys(object);
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
return(
  <View style={styles.tableContainer}>
    <View>
      <Image src={Logo} style={styles.logo} />
      <Text style={styles.text}>Liste des formateurs</Text>
      <Text style={styles.textMedium}>ISTA Bouznika</Text>
    </View>
    {
     keys.length===4&& 
     <View style={styles.header}>
      {
        keys.map((key,index)=>{
             return  <Text key={index} style={styles.xyz}>{capitalize(key)}</Text>
        })
    }
    </View>
}
    <TableRow items={data} />
  </View>
);
}

export default ItemsTable;
