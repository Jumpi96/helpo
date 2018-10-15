import * as jsPDF from 'jspdf'
import logo from '../../Reportes/Logo64'
import { getToday } from '../../../utils/Date'
import moment from 'moment';

/*
propuestas: {
  {eventoId}: {
    evento_nombre: 'Fiesta'
    empresa_nombre: 'Patitas'
    estado: 1
    detalle: [
      { nombre: 'Recurso-Pan', cantidad: 5, tipo: 'funcion|recurso'},
      ...
    ]
  }
}
recursos: {
  {'Recurso-Pan'}: cantidad,
  ...
}
voluntariados: {
  {'Funcion-chef'}: cantidad,
  ...
}
*/

// PDF Data values
let empresa_nombre = ""
let data_propuestas = {}
let data_recursos = {}
let data_voluntariados = {}
let total_propuestas = 0

// PDF Aux Values
let last_page = 1
let y_header = 10
const min_y = 30 // where to start drawing
const max_y = 270 // when to finish and add page
const step = 12 // distance between items
let current_y = 60
let last_title = {}
let draw_queue = []
// min h 30
// max h 270

function setNombre(nombre) {
  // If string is too long, insert endline and set text Y coord
  if (nombre.length > 25) {
    const new_nombre = [nombre.slice(0, 24), '\n', nombre.slice(24)].join('')
    return { empresa_nombre: new_nombre, y: 7 }
  }
  return { empresa_nombre: nombre, y: 10 }
}

function endPage(doc) {
  // Adds to the doc the footer and a new page with a header

  // Footer
  doc.setFontStyle('normal')
  doc.setFontSize(12)
  doc.line(5, 285, 205, 285)
  doc.text(getToday(), 5, 292)
  doc.text(last_page.toString(), 200, 292)
  last_page = last_page + 1

  doc.addPage()

  // Header
  doc.addImage(logo, 'PNG', 190, 0, 15, 15);
  doc.setFontSize(12)
  doc.setFontStyle("normal")
  doc.text(empresa_nombre, 5, y_header)
  doc.text("Reporte de colaboraciones", 70, 10)
  doc.line(5, 15, 205, 15)
}

function extractPropuestasData(propuestas, detalle_propuestas) {
  // Processes and extracts all needed data for the PDF from the necesidades object
  // and sets it in the draw_queue variable
  draw_queue = []
  empresa_nombre = detalle_propuestas.nombre
  /*
  { type: 0, nombre: "Recurso|Funcion - Algo"}
  { type: 1, nombre: "Juan Perez", cantidad: 5, entregado: true|false }
  */
  // Extract base data of propuestas
  for (const propuesta of propuestas) {
    total_propuestas = total_propuestas + 1
    const evento_id = propuesta.evento.id
    const base_propuesta = {
      evento_nombre: propuesta.evento.nombre,
      ong_nombre: propuesta.evento.organizacion.nombre,
      aceptado: propuesta.aceptado,
      detalle: []
    }
    data_propuestas[evento_id] = base_propuesta
  }

  // Extract participaciones and insert in base_propuesta detalles
  for (const participacion of detalle_propuestas.participacion) {
    const evento_id = participacion.necesidad_voluntario.evento
    const participacion_obj = {
      nombre: '',
      cantidad: 0,
      tipo: 'funcion'
    }
    participacion_obj.nombre = `Funcion - ${participacion.necesidad_voluntario.funcion.nombre}`
    participacion_obj.cantidad = participacion.cantidad
    data_propuestas[evento_id].detalle.push(participacion_obj)

    if (!data_voluntariados[participacion_obj.nombre]) {
      data_voluntariados[participacion_obj.nombre] = participacion_obj.cantidad
    }
    else {
      data_voluntariados[participacion_obj.nombre] = data_voluntariados[participacion_obj.nombre] + participacion_obj.cantidad
    }
  }

  // Extract colaboraciones and insert in base_propuesta detalles
  for (const colaboracion of detalle_propuestas.colaboracion) {
    const evento_id = colaboracion.necesidad_material.evento
    const colaboracion_obj = {
      nombre: '',
      cantidad: 0,
      tipo: 'recurso'
    }
    colaboracion_obj.nombre = `Recurso - ${colaboracion.necesidad_material.recurso.nombre}`
    colaboracion_obj.cantidad = colaboracion.cantidad
    data_propuestas[evento_id].detalle.push(colaboracion_obj)

    if (!data_recursos[colaboracion_obj.nombre]) {
      data_recursos[colaboracion_obj.nombre] = colaboracion_obj.cantidad
    }
    else {
      data_recursos[colaboracion_obj.nombre] = data_recursos[colaboracion_obj.nombre] + colaboracion_obj.cantidad
    }
  }
  createDrawItems()
}

function traduceAceptado(aceptado) {
  // Receives aceptado in int form, and return readable form
  switch(aceptado) {
    case -1:
      return 'rechazado'
    case 0:
      return 'pendiente'
    case 1:
      return 'aceptado'
    default:
    // It should never pass through default
      return 'ERROR'
  }
}

function createDrawItems() {
  // From processed data, populata draw_queue with items
  for (const id in data_propuestas) {
    // Propuesta general data - type 1
    const propuesta_stats = {
      type: 1,
      ong: data_propuestas[id].ong_nombre,
      aceptado: traduceAceptado(data_propuestas[id].aceptado),
      evento: data_propuestas[id].evento_nombre
    }
    draw_queue.push(propuesta_stats)

    for (const item of data_propuestas[id].detalle) {
      // Recurso type 2 - Funcion type 3 
      const type_item = item.tipo === 'recurso' ? 2 : 3 
      const obj_item = {
        type: type_item,
        nombre: item.nombre,
        cantidad: item.cantidad,
        tipo: item.tipo
      }
      draw_queue.push(obj_item)
    }    
  }
  // Un titulo - type 3
  const recurso_title = {
    type: 4,
    titulo: 'Totales ofrecidos a organizaciones:'
  }
  draw_queue.push(recurso_title)

  // Totales de recursos/voluntariados ofrecidos - type 4
  for (const recurso in data_recursos) {
    const draw_recurso = {
      type: 5,
      nombre: recurso,
      cantidad: data_recursos[recurso]
    }
    draw_queue.push(draw_recurso)
  }
  for (const voluntariado in data_voluntariados) {
    const draw_voluntariado = {
      type: 6,
      nombre: voluntariado,
      cantidad: data_voluntariados[voluntariado]
    }
    draw_queue.push(draw_voluntariado)
  }  
  console.log(draw_queue)
}

function drawItems(doc, draw_queue) {
  // Draws items in draw_queue array into the doc object
  for (const item of draw_queue) {
    if (item.type === 1) {
      
    }    
    if (item.type === 2) {
      
    }
    if (item.type === 3) {

    }
    if (item.type === 4) {

    }
    if (current_y > max_y) {
      // If the page is ending, create new one with title item at the top
      endPage(doc)
      current_y = min_y
      drawTitle(doc, last_title, current_y)
      current_y = current_y + step
    }
  }
}

function drawTitle(doc, item, y) {
  // Draw title in doc (title as in Funcion-Recurso)
  doc.setFontStyle('bold')
  doc.setFontSize(14)
  doc.text(`${item.nombre}  (${item.current_cantidad}/${item.max_cantidad})`, 5, y)
}

function drawDatosPropuestas(doc, item, y) {

}

function drawItem(doc, item, y) {
  // Draw item in doc (colaboracion|participacion)
  doc.setFontStyle('normal')
  doc.setFontSize(12)
  const text_y = y
  const sq_y = y - 3.5
  const sq_w = 4
  doc.rect(10, sq_y, sq_w, sq_w);
  doc.text(`${item.nombre}`, 23, text_y)
  doc.text(`${item.cantidad} ${item.tipo_recurso}`, 120, text_y)
}

function downloadPDF(propuestas, detalle_propuestas) {
  /*
  Generates and downloads the PDF report of the empresa propuestas
  */
  const doc = new jsPDF({ format: 'a4' })
  last_page = 1
  extractPropuestasData(propuestas, detalle_propuestas)
  empresa_nombre = setNombre(empresa_nombre).empresa_nombre
  y_header = setNombre(empresa_nombre).y
  const width = doc.internal.pageSize.getWidth()
  const center_x = (width / 2)

  // Header
  doc.addImage(logo, 'PNG', 190, 0, 15, 15);
  doc.setFontSize(12)
  doc.setFontStyle("normal")
  doc.text(empresa_nombre, 5, y_header)
  doc.text("Reporte de propuestas", center_x, 10, null, null, 'center')
  doc.line(5, 15, 205, 15)

  // Titulo
  doc.setFontStyle('bold')
  doc.text(center_x, 25, "Reporte de propuestas", null, null, 'center')

  doc.setFontStyle('normal')
  doc.text(`Total de propuestas: ${total_propuestas}`, 5, 35)
  doc.setFontStyle('bold')
  doc.text("Propuestas:", 5, 45)

  //drawItems(doc, draw_queue)

  // Footer
  doc.setFontStyle('normal')
  doc.setFontSize(12)
  doc.line(5, 285, 205, 285)
  doc.text(getToday(), 5, 292)
  doc.text(last_page.toString(), 200, 292)

  doc.save('propuestas_' + empresa_nombre + '_' + getToday() + '.pdf')
}

export default downloadPDF