import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'
import * as actions from '../../../../actions/albumEventoactions'

/*
This props must have those names so AlbumEvento can receive them properly

props:
  ongId
  ong
  eventoId
  evento
*/

class ButtonGoAlbum extends React.Component {

  constructor(props) {
    super(props)
    this.sendProps = this.sendProps.bind(this)
  }

  sendProps() {
    //This function will upload this.props to redux state so AlbumEvento has the props it needs
    this.props.uploadProps(this.props)
  }

  render() {
    return (
      <Link to='/actividades/album/20'>
        <Button color='primary' onClick={this.sendProps}>Ver Album</Button>
      </Link>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  uploadProps: props => dispatch(actions.getAlbumProps(props))
})

export default connect(null, mapDispatchToProps)(ButtonGoAlbum)