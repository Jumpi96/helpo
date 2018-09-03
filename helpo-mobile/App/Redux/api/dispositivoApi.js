import api from '../../api';

class DispositivoApi {

  static setDispositivo(email) {
    var dispositivo = { player_id: global.player_id, email: email };
    api.post('perfiles/device_id/', dispositivo)
      .then(res => {
        if (res.status === 201) {
          console.log('Dispositivo agregado: ', res.data);
        }
      }
      )
      .catch(
        (error) => {
          if (error.response.status === 400) {
            api.put(`/perfiles/device_id/${dispositivo.player_id}/`, dispositivo)
              .then(res => {
                if (res.status === 200) {
                  console.log('Dispositivo modificado: ', res.data);
                }
              }
              )
              .catch(
                (error) => {
                  console.log('Error: ', error);
                }
              )
          }
        }
      )
  }

  static deleteDispositivo(email) {
    var dispositivo = { player_id: global.player_id, email: email };
    api.delete(`/perfiles/device_id/${dispositivo.player_id}/`)
    .then(res => {
      if (res.status === 204) {
        console.log('Dispositivo eliminado: ', dispositivo.player_id);
      }
    }
    )
    .catch(
      (error) => {
        console.log('Error: ', error);
      }
    )
  }

}

export default DispositivoApi;