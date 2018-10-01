import React from 'react'
import PropTypes from 'prop-types'

/* 
  Este componente renderiza el boton para seleccionar archivo
  y llama a la función pasada por props.callback, pasandole
  por parametro como string la imagen en Base64
*/

const propTypes = {
  callback: PropTypes.func.isRequired
}


class ImagenSelecter extends React.Component {

  constructor(props) {
    super(props)
    this.onSelectFile = this.onSelectFile.bind(this);
  }

  onSelectFile(event) {
    // Toma el archivo y lo retorna encodedado en base 64
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () =>
          this.props.callback(reader.result),
        false
      )
      reader.readAsDataURL(event.target.files[0])
    }
  }

  render() {
    return (
      <div>
        <input style={{ marginBottom: '10px', marginTop: '10px' }} type='file' onChange={this.onSelectFile}/>
      </div>
    )
  }
}

ImagenSelecter.propTypes = propTypes

export default ImagenSelecter;