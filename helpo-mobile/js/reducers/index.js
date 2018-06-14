
import { combineReducers } from 'redux';

import drawer from './drawer';
import routes from './routes';
import auth from './auth';
import cardNavigation from './cardNavigation';

export default combineReducers({

  drawer,
  cardNavigation,
  routes,
  auth,
});
