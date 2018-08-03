import api from '../api';

class EventoApi {  
  static getAllEventos() {
    return api.get('/actividades/eventos/').then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }
  static getEventosOrganizacion() {
    return api.get('/organizaciones/eventos/').then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }
  static getEventosProximos() {
    return api.get('/actividades/consulta_eventos/').then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }
  static updateEvento(evento) {
    return api.put(`/actividades/eventos/${evento.id}/`, evento).then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }
}
export default EventoApi;