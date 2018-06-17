import api from '../api';

export function loadUser() {
  return (dispatch, getState) => {
    dispatch({ type: 'USER_LOADING' });
    const token = getState().auth.token;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Token ${token}`;
    }
    return api.get('/auth/user/', { headers })
      .then((res) => {
        dispatch({ type: 'USER_LOADED', user: res.data });
        return res.data;
      })
      .catch((e) => {
        if (e.response.status >= 400 && e.response.status < 500) {
          dispatch({ type: 'AUTHENTICATION_ERROR', data: e.response.data });
          //throw e.response.data;
        } else {
          console.log('Server Error!');
          //throw e.response;
        }
      })
      .done();
  };
}

export function login(email, password) {
  return (dispatch) => {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ email, password });

    return api.post('/auth/log_in/', body, { headers })
      .then((res) => {
        dispatch({ type: 'LOGIN_SUCCESSFUL', data: res.data });
        return res.data;
      })
      .catch((e) => {
        if (e.response.status === 403 || e.response.status === 401) {
          dispatch({ type: 'AUTHENTICATION_ERROR', data: e.response.data });
          //throw e.response.data;
        } else {
          dispatch({ type: 'LOGIN_FAILED', data: e.response.data });
          //throw e.response.data;
        }
      })
      .done();
  };
}

export function register(email, password) {
  return (dispatch) => {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ email, password });

    return api.post('/auth/sign_up/', body, { headers })
      .then((res) => {
        dispatch({ type: 'REGISTRATION_SUCCESSFUL', data: res.data });
        return res.data;
      })
      .catch((e) => {
        if (e.response.status === 403 || e.response.status === 401) {
          dispatch({ type: 'AUTHENTICATION_ERROR', data: e.response.data });
          throw e.response.data;
        } else {
          dispatch({ type: 'REGISTRATION_FAILED', data: e.response.data });
          throw e.response.data;
        }
      });
  };
}

export function logout() {
  return (dispatch) => {
    const headers = { 'Content-Type': 'application/json' };

    return api.post('/auth/logout/', JSON.stringify(''), { headers })
      .then((res) => {
        dispatch({ type: 'LOGOUT_SUCCESSFUL' });
        return res.data;
      })
      .catch((e) => {
        if (e.response.status === 403 || e.response.status === 401) {
          dispatch({ type: 'AUTHENTICATION_ERROR', data: e.response.data });
          //throw e.response.data;
        } else {
          console.log('Server Error!');
          //throw e.response;
        }
      })
      .done();
  };
}
