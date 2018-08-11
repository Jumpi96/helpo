import { call, put } from 'redux-saga/effects'
import { path } from 'ramda'
import AuthActions from '../Redux/AuthRedux'

export function * loadUser (api, action) {
  const { username } = action
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
        put(GithubActions.authenticationError());
      } else {
        throw e.response;
      }
    });
  yield put(GithubActions.userLoaded(user));
}
