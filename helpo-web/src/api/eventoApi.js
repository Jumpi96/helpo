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
  static updateEvento(evento) {
    api.put(`/actividades/eventos/${evento.id}/`, evento);
  }
  static deleteEvento(evento) {
    return api.delete(`/actividades/eventos/${evento.id}/`, evento).then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }
}
export default EventoApi;