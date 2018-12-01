import api from '../api'

export async function goVerEvento(evento, navigation) {
  /*
  Travel to VerEvento screen, of evento argument, fetching all
  required data

  evento: Evento Id
  navigation: Navigation Prop
  */
  try {  
    const evento_response = await api.get(`actividades/consulta_eventos/${evento}/`)
    const eventoData = evento_response.data
    navigation.navigate('ConsultarEvento', {evento: eventoData.id})
  }
  catch(error) {
    console.log(error)
  }
}