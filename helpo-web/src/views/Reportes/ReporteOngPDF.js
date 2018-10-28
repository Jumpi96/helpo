import * as jsPDF from 'jspdf'
import logo from './Logo64'
import { getToday } from '../../utils/Date'

function setNombre(nombre) {
  // If string is too long, insert endline and set text Y coord
  if(nombre.length > 25) {
    const new_nombre = [nombre.slice(0, 24), '\n', nombre.slice(24)].join('')
    return { ong_nombre: new_nombre, y: 7}
  }
  return { ong_nombre: nombre, y: 10}
}

function downloadPDF(imagenes, data) {
  /*
  Generates and downloads the PDF version of the ong dashboard
  imagenes: array con imagenes de graficos
  data: object with the ong stats
  */
  const doc = new jsPDF({format: 'a4'})
  //const width = doc.internal.pageSize.getWidth()
  const { suscripciones, manos, eventos, voluntarios, nombre } = data
  const { ong_nombre, y } = setNombre(nombre)
  //(width/2-10) Para centrar mas o menos algo

  // Header
  doc.addImage(logo, 'PNG', 190, 0, 15, 15);
  doc.setFontSize(12)
  doc.setFontStyle("normal")
  doc.text(ong_nombre, 5, y)
  doc.text("Estadísticas de la organización", 70, 10)
  doc.line(5, 15, 205, 15)

  doc.setFontStyle('bold')  
  doc.text('Estadísticas de la organización', 67, 26)

  doc.setFontStyle('normal')
  doc.setFontSize(11)
  doc.text(`Total de suscripciones: ${suscripciones}`, 6, 40)
  doc.text(`Total de eventos realizados: ${eventos}`, 140, 40)
  doc.text(`Total de manos recibidas: ${manos}`, 6, 50)
  doc.text(`Total de voluntarios participantes: ${voluntarios}`, 140, 50)

  doc.setFontStyle('bold')
  doc.text(`Suscripciones por mes`, 78, 75)
  doc.addImage(imagenes[0], 'PNG', 15, 80, 180, 70);
  doc.text(`Voluntarios por género`, 78, 175)
  doc.addImage(imagenes[1], 'PNG', 15, 180, 180, 70);

  // Footer
  doc.line(5, 285, 205, 285)
  doc.text(getToday(), 5, 292)
  doc.text('1', 200, 292)

  doc.addPage()

  // Header
  doc.addImage(logo, 'PNG', 190, 0, 15, 15);
  doc.setFontSize(12)
  doc.setFontStyle("normal")
  doc.text(ong_nombre, 5, y)
  doc.text("Estadísticas de la organización", 70, 10)
  doc.line(5, 15, 205, 15)

  doc.setFontSize(11)
  doc.setFontStyle('bold')
  doc.text(`Manos recibidas por evento`, 77, 25)
  doc.addImage(imagenes[2], 'PNG', 15, 30, 180, 70);
  doc.text(`Colaboraciones por evento`, 77, 125)
  doc.addImage(imagenes[3], 'PNG', 15, 130, 180, 70);

  // Footer
  doc.line(5, 285, 205, 285)
  doc.text(getToday(), 5, 292)
  doc.text('2', 200, 292)

  doc.addPage()

  // Header
  doc.addImage(logo, 'PNG', 190, 0, 15, 15);
  doc.setFontSize(12)
  doc.setFontStyle("normal")
  doc.text(ong_nombre, 5, y)
  doc.text("Estadísticas de la organización", 70, 10)
  doc.line(5, 15, 205, 15)

  doc.setFontSize(11)
  doc.setFontStyle('bold')
  doc.line(5, 15, 205, 15)
  doc.text(`Participaciones por evento`, 77, 25)
  doc.addImage(imagenes[4], 'PNG', 15, 30, 180, 70);
  doc.text(`Empresas más contribuidoras`, 77, 125)
  doc.addImage(imagenes[5], 'PNG', 15, 130, 180, 70);

  // Footer
  doc.line(5, 285, 205, 285)
  doc.text(getToday(), 5, 292)
  doc.text('3', 200, 292)

  doc.save('reporte-' + nombre + '-' + getToday() + '.pdf')  
}

export default downloadPDF