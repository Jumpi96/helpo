
import { combineReducers } from 'redux';

import drawer from './drawer';
import routes from './routes';
import auth from './auth';
import cardNavigation from './cardNavigation';
import eventos from './eventoReducer';
import rubrosEvento from './rubrosEventoReducer';

export default combineReducers({

  drawer,
  cardNavigation,
  routes,
  auth,
  eventos,
  rubrosEvento,
});
