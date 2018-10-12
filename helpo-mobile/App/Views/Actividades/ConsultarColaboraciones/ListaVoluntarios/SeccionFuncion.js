import React from 'react'
import ListaVoluntarios from './ListaVoluntarios'
import { View } from 'react-native'

const SeccionFuncion = (props) => {
  const { voluntarios } = props
  let listas = []
  for (let voluntario of voluntarios) {
    const participaciones = voluntario.participaciones
    const funcion = voluntario.funcion.nombre
    let descripcion = voluntario.descripcion;
    descripcion = descripcion.length > 18 ? descripcion.slice(0, 18) + '...' : descripcion;
    listas.push(
      <ListaVoluntarios
        navigation={props.navigation}
        key={'lista-volun-' + voluntario.id}
        funcion={funcion}
        descripcion={descripcion}
        participaciones={participaciones}
      />)
  }
  return (
    <View>
      {listas}
    </View>
  )
}

export default SeccionFuncion