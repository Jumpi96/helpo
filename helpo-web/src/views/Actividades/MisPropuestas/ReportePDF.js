import * as jsPDF from 'jspdf'
import logo from '../../Reportes/Logo64'
import { getToday } from '../../../utils/Date'
import moment from 'moment';

/* LO DEJO COMO "DOCUMENTACION"
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

item_types:

This items types exist to manage the different ways to draw them in the PDF 

{type: 1, ong: "", aceptado: "", evento: "", fecha_hora: ""}
{type: 2, nombre: "", cantidad: "", tipo: ""(recurso/funcion)} TYPE 2 == Recurso
{type: 3, nombre: "", cantidad: "", tipo: ""(recurso/funcion)} TYPE 3 == Funcion
{type: 4, titulo: ""}
{type: 5, nombre: "", cantidad: 0} RECURSO
{type: 6, nombre: "", cantidad: 0} VOLUNTARIO/FUNCION
{type: 7, titulo: "", x: } SUBTITULO
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
const step = 8 // distance between items
let current_y = 55
let draw_queue = []


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
  // Extract base data of propuestas
  for (const propuesta of propuestas) {
    total_propuestas = total_propuestas + 1
    const evento_id = propuesta.evento.id
    const base_propuesta = {
      evento_nombre: propuesta.evento.nombre,
      ong_nombre: propuesta.evento.organizacion.nombre,
      aceptado: propuesta.aceptado,
      fecha_hora: moment(propuesta.evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm'),
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
      evento: data_propuestas[id].evento_nombre,
      fecha_hora: data_propuestas[id].fecha_hora
    }
    draw_queue.push(propuesta_stats)

    let last_item = null
    for (const item of data_propuestas[id].detalle) {
      // Recurso type 2 - Funcion type 3 

      if (last_item !== item.tipo) {
        const titulo = item.tipo === 'recurso' ?
        "Recursos ofrecidos:" :
        "Voluntarios ofrecidos:"
        const title_obj = {
          type: 7,
          titulo: titulo,
          x: 15
        }
        draw_queue.push(title_obj)
        last_item = item.tipo
      }

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
  // Un titulo - type 4
  const recurso_title = {
    type: 4,
    titulo: 'Totales ofrecidos a organizaciones:'
  }
  draw_queue.push(recurso_title)

  // Totales de recursos/voluntariados ofrecidos - type 5/6
  let recurso_total_title = false
  for (const recurso in data_recursos) {

    if(!recurso_total_title) {
      const title_obj = {
        type: 7,
        titulo: 'Total de recursos:',
        x: 5
      }
      recurso_total_title = true
      draw_queue.push(title_obj)    
    }

    const draw_recurso = {
      type: 5,
      nombre: recurso,
      cantidad: data_recursos[recurso]
    }
    draw_queue.push(draw_recurso)
  }

  let funcion_total_title = false
  for (const voluntariado in data_voluntariados) {

    if(!funcion_total_title) {
      const title_obj = {
        type: 7,
        titulo: 'Total de voluntarios:',
        x: 5
      }
      funcion_total_title = true
      draw_queue.push(title_obj)    
    }

    const draw_voluntariado = {
      type: 6,
      nombre: voluntariado,
      cantidad: data_voluntariados[voluntariado]
    }
    draw_queue.push(draw_voluntariado)
  }
}

function drawItems(doc, draw_queue) {
  // Draws items in draw_queue array into the doc object
  for (const item of draw_queue) {
    if (item.type === 1) {
      drawDatosPropuestas(doc, item)
    }    
    if (item.type === 2) {
      drawDetalleRecurso(doc, item)
    }
    if (item.type === 3) {
      drawDetalleFuncion(doc, item)
    }
    if (item.type === 4) {
      drawTitle(doc, item)
    }
    if (item.type === 5) {
      drawTotalRecurso(doc, item)
    }
    if (item.type === 6) {
      drawTotalVoluntarios(doc, item)
    }
    if (item.type === 7) {
      drawSubtitle(doc, item)
    }
    if (current_y > max_y) {
      // If the page is ending, create new one with title item at the top
      endPage(doc)
      current_y = min_y
    }
  }
}

function drawTitle(doc, item) {
  // 3 step
  // Draw title in doc (draw_item type 4)
  let draw_first_space = true

  const to_use_y = current_y + (step * 10)
  if (to_use_y > max_y) {
    // If there isnt some space before page ends, draw in new one
    endPage(doc)
    current_y = min_y
    draw_first_space = false
  }
  if (draw_first_space) {
    current_y = current_y + step
  }  
  // Space before title
  doc.setFontStyle('bold')
  doc.setFontSize(14)
  doc.text(item.titulo, 5, current_y)
  current_y = current_y + step
  // Space after title
  current_y = current_y + step
}

function drawSubtitle(doc, item) {
  // variable step
  // Draw subtitle in doc (draw_item type 4)

  const to_use_y = current_y + (step * 5)
  if (to_use_y > max_y) {
    // If there isnt some space before page ends, draw in new one
    endPage(doc)
    current_y = min_y
  }
  // Space before title
  doc.setFontStyle('bold')
  doc.setFontSize(12)
  doc.text(item.titulo, item.x, current_y)
  current_y = current_y + step
  // Space after title
}

function drawTotalRecurso(doc, item) {
  // 1 step
  // Draw total de recurso (draw_item type 5)
  const descriptor = item.cantidad === 1 ? "unidad" : "unidades"

  doc.setFontStyle('bold')
  doc.setFontSize(12)
  doc.text(item.nombre, 15, current_y)
  doc.setFontStyle('normal')
  doc.text(`${item.cantidad} ${descriptor}`, 100, current_y)
  current_y = current_y + step
}

function drawTotalVoluntarios(doc, item) {
  // 1 step
  // Draw total de recurso (draw_item type 5)
  const descriptor = item.cantidad === 1 ? "voluntario" : "voluntarios"

  doc.setFontStyle('bold')
  doc.setFontSize(12)
  doc.text(item.nombre, 15, current_y)
  doc.setFontStyle('normal')
  doc.text(`${item.cantidad} ${descriptor}`, 100, current_y)
  current_y = current_y + step
}

function drawDatosPropuestas(doc, item) {
  // 5 step
  // Draws draw_item type 1 in doc (datos de propuesta)
  const to_use_y = current_y + (step * 6)
  if (to_use_y > max_y) {
    // If item exceeds available space, create new page
    endPage(doc)
    current_y = min_y
  }
  // Extra step to have space between propuestas
  current_y = current_y + step
  doc.setFontStyle('bold')
  doc.setFontSize(12)
  doc.text(`Propuesta de actividad:  ${item.evento}` ,5, current_y)
  current_y = current_y + step
  doc.setFontStyle('normal')
  doc.text(`Organización: ${item.ong}` ,5, current_y)
  current_y = current_y + step
  doc.text(`Fecha y hora de inicio de la actividad:  ${item.fecha_hora}` ,5, current_y)
  current_y = current_y + step 
  doc.text(`Estado: ${item.aceptado}` ,5, current_y)
  current_y = current_y + step 
  doc.text("Detalles:" , 5, current_y)
  current_y = current_y + step 
}

function drawDetalleRecurso(doc, item) {
  // 1 step
  // Draws draw_item type 2 (detalle recurso)
  const descriptor = item.cantidad === 1 ? "unidad" : "unidades"

  doc.setFontStyle('bold')
  doc.setFontSize(12)
  doc.text(item.nombre, 30, current_y)
  doc.setFontStyle('normal')
  doc.text(`${item.cantidad} ${descriptor}`, 105, current_y)
  current_y = current_y + step
}

function drawDetalleFuncion(doc, item) {
  // 1 step
  // Draws draw_item type 2 (detalle recurso)
  const descriptor = item.cantidad === 1 ? "voluntario" : "voluntarios"

  doc.setFontStyle('bold')
  doc.setFontSize(12)
  doc.text(item.nombre, 30, current_y)
  doc.setFontStyle('normal')
  doc.text(`${item.cantidad} ${descriptor}`, 105, current_y)
  current_y = current_y + step
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
  doc.setFontSize(16)
  doc.text(center_x, 25, "Reporte de propuestas", null, null, 'center')

  doc.setFontSize(12)
  doc.setFontStyle('normal')
  doc.text(`Total de propuestas: ${total_propuestas}`, 5, 35)
  doc.setFontStyle('bold')
  doc.setFontSize(14)
  doc.text("Propuestas:", 5, 45)
  doc.setFontSize(12)

  drawItems(doc, draw_queue)

  // Footer
  doc.setFontStyle('normal')
  doc.setFontSize(12)
  doc.line(5, 285, 205, 285)
  doc.text(getToday(), 5, 292)
  doc.text(last_page.toString(), 200, 292)

  doc.save('propuestas_' + empresa_nombre + '_' + getToday() + '.pdf')
}

export default downloadPDF