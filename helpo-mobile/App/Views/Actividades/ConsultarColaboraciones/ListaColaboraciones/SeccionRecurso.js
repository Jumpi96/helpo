import React from 'react'
import ListaColaboraciones from './ListaColaboraciones'
import { View } from 'react-native'

const SeccionRecurso = (props) => {
  const { necesidades } = props
  let listas = []  
  for(let necesidad of necesidades) {
    console.tron.log(necesidad)
    const colaboraciones = necesidad.colaboraciones 
    const recurso = necesidad.recurso.nombre
    listas.push(
      <ListaColaboraciones 
        navigation={props.navigation}
        key={ 'lista-colab-'+necesidad.id }
        necesidad={ recurso } 
        colaboraciones={ colaboraciones } 
      />) 
  }
  return (
    <View>
      {listas}
    </View>
  )
}

export default SeccionRecurso