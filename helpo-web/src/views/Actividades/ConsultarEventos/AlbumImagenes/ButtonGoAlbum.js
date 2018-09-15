import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
/*
This props must have those names so AlbumEvento can receive them properly

props:
  ongId
  ong
  eventoId
  evento
*/

class ButtonGoAlbum extends React.Component {
  
  render() {
    return (
      <Link to={`/actividades/album/${this.props.eventoId}`}>
        <Button color='primary'>Ver Album</Button>
      </Link>
    )
  }
}

export default ButtonGoAlbum