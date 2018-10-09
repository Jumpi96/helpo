import * as jsPDF from 'jspdf'
import logo from './Logo64'

function downloadPDF(imagenes) {
  const doc = new jsPDF({format: 'a4'})
  const width = doc.internal.pageSize.getWidth();    
  const height = doc.internal.pageSize.getHeight();
  console.log(width)
  console.log(height)
  doc.addImage(logo, 'PNG', (width/2-10), 0, 20, 20);
  doc.line(5, 20, 205, 20)
  doc.text('Hello world!', 100, 30)
  doc.addImage(imagenes[0], 'PNG', 15, 40, 180, 70);
  doc.addImage(imagenes[1], 'PNG', 15, 120, 180, 70);
  doc.save('a4.pdf')
}

export default downloadPDF