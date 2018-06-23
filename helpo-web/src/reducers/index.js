import { combineReducers } from "redux";
import auth from "./auth";
import eventos from "./eventoReducer";

export const helpo = combineReducers({
  auth,
  eventos
})