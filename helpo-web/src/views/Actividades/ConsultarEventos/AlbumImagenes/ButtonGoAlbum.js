import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'


class ButtonGoAlbum extends React.Component {

  render() {
    return (
      <Link to='/actividades/album/20'>
        <Button color='primary'>Ver Album</Button>
      </Link>
    )
  }
}

export default ButtonGoAlbum