import api from '../../api';

class RubroEventoApi {  
  static getAllRubrosEvento() {
    return api.get('/actividades/rubros_evento/').then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }
}
export default RubroEventoApi;