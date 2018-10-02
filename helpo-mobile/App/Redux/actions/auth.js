import api from '../../api';
import dispositivoApi from '../api/dispositivoApi';

export function loadUser() {
    return (dispatch) => {
        dispatch({ type: 'USER_LOADING' });

        const headers = {
            'Content-Type': 'application/json',
        };

        return api.get('/auth/user/', { headers })
            .then((res) => {
                dispatch({ type: 'USER_LOADED', user: res.data });
                return res.data;
            })
            .catch((e) => {
                if (e.response && e.response.status >= 400 && e.response.status < 500) {
                    dispatch({ type: "AUTHENTICATION_ERROR", data: e.response.data });
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
                dispositivoApi.setDispositivo(email);
                dispatch({ type: 'LOGIN_SUCCESSFUL', data: res.data });
                return res.data;
            })
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 406) {
                        dispatch({ type: "LOGIN_UNVERIFIED", data: e.response.data });
                        return e.response.status;
                    }
                    if (e.response.status === 403 || e.response.status === 401) {
                        dispatch({ type: 'AUTHENTICATION_ERROR', data: e.response.data });
                    } else {
                        dispatch({ type: 'LOGIN_FAILED', data: e.response.data });
                    }
                }
            })
            .done();
    };
}

export function loginGoogleFacebook(url, nombre, email, password, user_type, apellido, id_token) {
    return (dispatch) => {
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify({ nombre, email, password, user_type, apellido, id_token });

        return api.post(url, body, { headers })
            .then(res => {
                dispositivoApi.setDispositivo(email);
                dispatch({ type: 'LOGIN_SUCCESSFUL', data: res.data });
                return res.data;
            })
            .catch(e => {
                if (e.response) {
                    if (e.response.status === 403 || e.response.status === 401) {
                        dispatch({ type: "AUTHENTICATION_ERROR", data: e.response.data });
                    } else {
                        dispatch({ type: "LOGIN_FAILED", data: e.response.data });
                    }
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
                if (e.response) {
                    if (e.response.status === 403 || e.response.status === 401) {
                        dispatch({ type: 'AUTHENTICATION_ERROR', data: e.response.data });
                        throw e.response.data;
                    } else {
                        dispatch({ type: 'REGISTRATION_FAILED', data: e.response.data });
                        throw e.response.data;
                    }
                }
            });
    };
}

export function logout(email) {
    return (dispatch) => {
        const headers = { 'Content-Type': 'application/json' };
        dispatch({ type: 'LOGOUT_SUCCESSFUL' });

        return api.post('/auth/logout/', JSON.stringify(''), { headers })
            .then((res) => {
                dispositivoApi.deleteDispositivo(email);
                return res.data;
            })
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 403 || e.response.status === 401) {
                        dispatch({ type: 'AUTHENTICATION_ERROR', data: e.response.data });
                    } else {
                        console.log('Server Error!');
                    }
                }
            })
            .done();
    };
}
