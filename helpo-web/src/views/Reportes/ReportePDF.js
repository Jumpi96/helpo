import React from 'react'
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer'

const MyDoc = () => (
  <Document>
    <Page>
      <Text>Hello World</Text>
    </Page>
  </Document>
)

const Download = () => (
  <div>
    <div>
    <PDFDownloadLink document={MyDoc} fileName="somename.pdf">
      {({ blob, url, loading, error }) => (
        loading ? 'Loading document...' : 'Download now!'
      )}
    </PDFDownloadLink>
  </div>
  </div>
)

export default Download
