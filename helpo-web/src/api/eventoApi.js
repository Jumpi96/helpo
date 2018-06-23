import api from '../api';

class EventoApi {  
  static getAllEventos() {
    return api.get('/actividades/eventos/').then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }
}
export default EventoApi;