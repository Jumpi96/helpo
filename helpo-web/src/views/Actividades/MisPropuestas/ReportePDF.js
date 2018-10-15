import * as jsPDF from 'jspdf'
import logo from '../../Reportes/Logo64'
import { getToday } from '../../../utils/Date'
import moment from 'moment';

/*
propuestas: {
  {eventoId}: {
    evento_nombre: 'Fiesta'
    ong_nombre: 'Patitas'
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

// PDF Values
let y_header = 10
let ong_nombre = ""
let fecha_hora_inicio = ""
let evento_nombre = ""
let last_page = 1

let draw_queue = []
// min h 30
// max h 270

function setNombre(nombre) {
  // If string is too long, insert endline and set text Y coord
  if(nombre.length > 25) {
    const new_nombre = [nombre.slice(0, 24), '\n', nombre.slice(24)].join('')
    return { ong_nombre: new_nombre, y: 7}
  }
  return { ong_nombre: nombre, y: 10}
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
  doc.text(ong_nombre, 5, y_header)
  doc.text("Reporte de colaboraciones", 70, 10)
  doc.line(5, 15, 205, 15)
}

function tickSquare(doc, sq_x, sq_y, sq_width) {  
  // Receives a square coordinates and draws a tick over it
  doc.setLineWidth(0.5)
  const l1_start_x = (sq_x - 2) + 2 
  const l1_start_y = (sq_y + sq_width/2)
  const l1_end_x = (8 + sq_width/3) + 2
  const l1_end_y = (sq_y + sq_width)

  const l2_start_x = l1_end_x
  const l2_start_y = l1_end_y
  const l2_end_x = (8 + sq_width + 1) + 2
  const l2_end_y = (sq_y - 1)
  
  doc.line(l1_start_x, l1_start_y, l1_end_x, l1_end_y)
  doc.line(l2_start_x, l2_start_y, l2_end_x, l2_end_y)

  // I reset the doc line width to the default
  doc.setLineWidth(0.2)
}

function extractNecesidadesData(obj_necesidades) {
  // Processes and extracts all needed data for the PDF from the necesidades object
  // and sets it in the draw_queue variable
  draw_queue = []
  evento_nombre = obj_necesidades.nombre
  fecha_hora_inicio = moment(obj_necesidades.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')
  /*
  { type: 0, nombre: "Recurso|Funcion - Algo"}
  { type: 1, nombre: "Juan Perez", cantidad: 5, entregado: true|false }
  */
  const { necesidades, voluntarios } = obj_necesidades

  for(const necesidad of necesidades) {
    const material_obj = { 
      type: 0,
      nombre: "Recurso - " + necesidad.recurso.nombre,
      max_cantidad: necesidad.cantidad,
      current_cantidad: 0
    }
    draw_queue.push(material_obj)
    
    for(const colaboracion of necesidad.colaboraciones) {
      const nombre = colaboracion.colaborador.nombre
      const apellido = colaboracion.colaborador.apellido ? colaboracion.colaborador.apellido : "" 
      const entregado = colaboracion.cantidad === colaboracion.entregados
      const colaboracion_obj = { 
        type: 1,
        nombre: nombre + " " + apellido,
        cantidad: colaboracion.cantidad,
        entregado: entregado,
        tipo_recurso: "unidad",
       }

       material_obj.current_cantidad = material_obj.current_cantidad + colaboracion_obj.cantidad

       if (colaboracion_obj.cantidad > 1) {
        colaboracion_obj.tipo_recurso =  colaboracion_obj.tipo_recurso + "es"
       }
       draw_queue.push(colaboracion_obj)
    }
  }

  for(const funcion of voluntarios) {
    const funcion_obj = { 
      type: 0,
      nombre: "Función - " + funcion.funcion.nombre,
      max_cantidad: funcion.cantidad,
      current_cantidad: 0
    }
    draw_queue.push(funcion_obj)
    
    for(const participacion of funcion.participaciones) {
      const nombre = participacion.colaborador.nombre
      const apellido = participacion.colaborador.apellido ? participacion.colaborador.apellido : "" 
      const entregado = participacion.cantidad === participacion.presencias
      const participacion_obj = { 
        type: 1,
        nombre: nombre + " " + apellido,
        cantidad: participacion.cantidad,
        entregado: entregado,
        tipo_recurso: "voluntario",
       }

       funcion_obj.current_cantidad = funcion_obj.current_cantidad + participacion_obj.cantidad 

       if (participacion_obj.cantidad > 1) {
        participacion_obj.tipo_recurso = participacion_obj.tipo_recurso + "s"
       }
       draw_queue.push(participacion_obj)
    }
  }
}

function drawItems(doc, draw_queue) {
  // Draws items in draw_queue array into the doc object  
  const min_y = 30 // where to start drawing
  const max_y = 270 // when to finish and add page
  const step = 12 // distance between items
  let current_y = 60
  let last_title = {}

  for (const item of draw_queue) {
    if (item.type === 0) { 
      last_title = item      
      if (!((current_y + step) > max_y)) {
        // If the title item is going to be the last thing in the page, skip it
        drawTitle(doc, item, current_y)
      }            
     }
     if (item.type === 1) {
       drawItem(doc, item, current_y)
     }

    current_y = current_y + step

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

function drawItem(doc, item, y) {
  // Draw item in doc (colaboracion|participacion)
  doc.setFontStyle('normal')
  doc.setFontSize(12)
  const text_y = y
  const sq_y = y - 3.5
  const sq_w = 4
  doc.rect(10, sq_y, sq_w, sq_w);
  doc.text(`${item.nombre}` ,23, text_y)
  doc.text(`${item.cantidad} ${item.tipo_recurso}`, 120, text_y)
  if (item.entregado) {
    tickSquare(doc, 10, sq_y, sq_w)
  }
}
//entregados
//presencias

function downloadPDF(necesidades, nombre) {
  /*
  Generates and downloads the PDF version of the ong dashboard
  imagenes: array con imagenes de graficos
  data: necesidades object (colaboraciones + participaciones)
  */
  const doc = new jsPDF({format: 'a4'})
  last_page = 1
  ong_nombre = setNombre(nombre).ong_nombre
  y_header = setNombre(nombre).y
  extractNecesidadesData(necesidades)
  const width = doc.internal.pageSize.getWidth()
  const center_x = (width/2) 

  // Header
  doc.addImage(logo, 'PNG', 190, 0, 15, 15);
  doc.setFontSize(12)
  doc.setFontStyle("normal")
  doc.text(ong_nombre, 5, y_header)
  doc.text("Reporte de colaboraciones", center_x, 10, null, null, 'center')
  doc.line(5, 15, 205, 15)

  doc.setFontStyle('bold')  
  doc.text(center_x, 25, 'Reporte de colaboraciones',  null, null, 'center')

  doc.text(`Evento: `, 5, 37)
  doc.text("Fecha/hora de inicio: ", 5, 45)  
  doc.setFontStyle('normal')
  doc.setFontSize(12)
  doc.text(evento_nombre, 22, 37)
  doc.text(fecha_hora_inicio, 50, 45)

  drawItems(doc, draw_queue)

  // Footer
  doc.setFontStyle('normal')
  doc.setFontSize(12)
  doc.line(5, 285, 205, 285)
  doc.text(getToday(), 5, 292)
  doc.text(last_page.toString(), 200, 292)

  doc.save('colaboraciones_' + evento_nombre + '_' + getToday() + '.pdf')  
}

export default downloadPDF