import React from 'react'
import { Page, Text, Image, View, Document, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {    
    //backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
  },
  centerCtn: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  separator: {    
    paddingHorizontal: 50,
    width: 500,
    height: 2,
    borderBottom: "1px solid gray",
  },
  p: {
    fontSize: 12,
    marginVertical: 10
  }
  
});

// Create Document Component
const PDF = (images, totales) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>helpo</Text>
      </View>
      <View style={styles.centerCtn}>
        <View style={styles.separator}/>
      </View>
      <View style={styles.section}>
        <Text style={styles.p}>Total de suscripciones: </Text>
        <Text style={styles.p}>Total de eventos realizados: </Text>
        <Text style={styles.p}>Total de manos recibidas: </Text>
        <Text style={styles.p}>Total de voluntarios participantes: </Text>
        <Image src={{ data: images[0], format: 'png' }} />
        {console.log(images[0])}
      </View>
    </Page>
  </Document>
)

export default PDF
