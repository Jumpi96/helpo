import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import AuthActions from '../Redux/AuthRedux'
import api from '../api';

export function * loadUser () {
  // make the call to the api
  const headers = {
    'Content-Type': 'application/json',
  };
  let user;
  api.get('/auth/user/', { headers })
    .then((res) => {
      user = res.data;
    })
    .catch((e) => {
      if (e.response.status >= 400 && e.response.status < 500) {
        put(AuthActions.authenticationError());
      } else {
        throw e.response;
      }
    });
  yield put(AuthActions.userLoaded(user));
}

export function * login (email, password) {
  const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ email, password });
    let data;
    return api.post('/auth/log_in/', body, { headers })
      .then((res) => {
        put(AuthActions.loginSuccessful(res));
      })
      .catch((e) => {
        if (e.response.status === 403 || e.response.status === 401) {
          put(AuthActions.authenticationError());
        } else {
          put(AuthActions.failedLogin());
        }
      })
}
