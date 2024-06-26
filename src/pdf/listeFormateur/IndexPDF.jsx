// App.js
import React from "react";
import {  Page, Document, Text } from "@react-pdf/renderer";
import ItemsTable from "./ItemsTable";
import styles from "./styles";
const IndexPDF = ({ data }) => {
  return (
        <Document>
          <Page size="A4" style={styles.page}>
            <ItemsTable data={data} />
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
              `${pageNumber} / ${totalPages}`
            )} fixed />
          </Page>
        </Document>
  );
};

export default IndexPDF;
