import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

/*
Boton para ir al perfil de un usuario
props:
  id (id de usuario)
*/
const perfilButton = (props) => (
  <Link to={`/perfil/${props.id}`}>
    <Button color='secondary'>Ir a Perfil</Button>
  </Link>
)

export default perfilButton