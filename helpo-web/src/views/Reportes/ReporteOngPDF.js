import * as jsPDF from 'jspdf'
import logo from './Logo64'
import { getToday } from '../../utils/Date'

function downloadPDF(imagenes, data) {
  /*
  Generates and downloads the PDF version of the ong dashboard
  imagenes: array con imagenes de graficos
  data: object with the ong stats
  */
  const doc = new jsPDF({format: 'a4'})
  const width = doc.internal.pageSize.getWidth()
  const { suscripciones, manos, eventos, voluntarios } = data

  doc.addImage(logo, 'PNG', (width/2-10), 0, 15, 15);
  doc.line(5, 15, 205, 15)

  doc.setFontStyle('bold')
  doc.setFontSize(14)
  doc.text('Estadísticas de la organización', 67, 26)

  doc.setFontStyle('normal')
  doc.setFontSize(11)
  doc.text(`Total de suscripciones: ${suscripciones}`, 6, 40)
  doc.text(`Total de eventos realizados: ${manos}`, 140, 40)
  doc.text(`Total de manos recibidas: ${eventos}`, 6, 50)
  doc.text(`Total de voluntarios participantes: ${voluntarios}`, 140, 50)

  doc.setFontStyle('bold')
  doc.text(`Suscripciones por mes`, 78, 75)
  doc.addImage(imagenes[0], 'PNG', 15, 80, 180, 70);
  doc.text(`Voluntarios por género`, 78, 175)
  doc.addImage(imagenes[1], 'PNG', 15, 180, 180, 70);

  doc.addPage()

  doc.addImage(logo, 'PNG', (width/2-10), 0, 15, 15);
  doc.line(5, 15, 205, 15)
  doc.text(`Manos recibidas por evento`, 77, 25)
  doc.addImage(imagenes[2], 'PNG', 15, 30, 180, 70);
  doc.text(`Colaboraciones por evento`, 77, 125)
  doc.addImage(imagenes[3], 'PNG', 15, 130, 180, 70);

  doc.addPage()

  doc.addImage(logo, 'PNG', (width/2-10), 0, 15, 15);
  doc.line(5, 15, 205, 15)
  doc.text(`Participaciones por evento`, 77, 25)
  doc.addImage(imagenes[4], 'PNG', 15, 30, 180, 70);
  doc.text(`Empresas más contribuidoras`, 77, 125)
  doc.addImage(imagenes[5], 'PNG', 15, 130, 180, 70);

  doc.save('reporteONG-' + getToday() + '.pdf')  
}

export default downloadPDF