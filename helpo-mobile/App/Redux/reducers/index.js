
import { combineReducers } from 'redux';

import auth from './auth';
import eventos from './eventoReducer';
import rubrosEvento from './rubrosEventoReducer';

export default combineReducers({
  auth,
  eventos,
  rubrosEvento,
});
