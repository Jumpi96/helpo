import { combineReducers } from "redux";
import auth from "./auth";
import eventos from "./eventoReducer";
import rubrosEvento from "./rubrosEventoReducer";
import { consultarColaboraciones } from './consultarColaboracionesReducer'

export const helpo = combineReducers({
  auth,
  eventos,
  rubrosEvento,
  consultarColaboraciones
})