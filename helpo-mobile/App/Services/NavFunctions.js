import api from '../api'

export async function goVerEvento(evento, navigation) {
  /*
  Travel to VerEvento screen, of evento argument, fetching all
  required data

  evento: Evento Id
  navigation: Navigation Prop
  */
  try {  
    const rubros_response = await api.get('actividades/rubros_evento/')
    const evento_response = await api.get(`actividades/eventos/${evento}/`)
    const rubros = rubros_response.data
    const eventoData = evento_response.data
    navigation.navigate('VerEvento', {evento: eventoData, rubros: rubros})
  }
  catch(error) {
    console.log(error)
  }
}