import React from 'react'
import ListaVoluntarios from './ListaVoluntarios'
import { View } from 'react-native'

const SeccionFuncion = (props) => {
  const { voluntarios } = props
  let listas = []
  for(let voluntario of voluntarios) {
    const participaciones = voluntario.participaciones 
    const funcion = voluntario.funcion.nombre
    listas.push(
      <ListaVoluntarios 
      navigation={props.navigation}
      key={ 'lista-volun-'+voluntario.id }
      funcion={ funcion } 
      participaciones={ participaciones } 
      />) 
  }
  return (
    <View>
      {listas}
    </View>
  )
}

export default SeccionFuncion