import { combineReducers } from "redux";
import auth from "./auth";
import eventos from "./eventoReducer";
import rubrosEvento from "./rubrosEventoReducer";
import { misColaboraciones } from './misColaboracionesReducer'

export const helpo = combineReducers({
  auth,
  eventos,
  rubrosEvento,
  misColaboraciones
})