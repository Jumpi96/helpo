import React from 'react'
import ListaColaboraciones from './ListaColaboraciones'
import { View } from 'react-native'

const SeccionRecurso = (props) => {
  const { necesidades } = props
  let listas = []
  for (let necesidad of necesidades) {
    console.tron.log(necesidad)
    const colaboraciones = necesidad.colaboraciones
    const recurso = necesidad.recurso.nombre
    let descripcion = necesidad.descripcion;
    descripcion = descripcion.length > 18 ? descripcion.slice(0, 18) + '...' : descripcion;
    listas.push(
      <ListaColaboraciones
        navigation={props.navigation}
        key={'lista-colab-' + necesidad.id}
        necesidad={recurso}
        descripcion={descripcion}
        colaboraciones={colaboraciones}
      />)
  }
  return (
    <View>
      {listas}
    </View>
  )
}

export default SeccionRecurso