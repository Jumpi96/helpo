import api from '../api';

export const loadUser = () => {
  return (dispatch, getState) => {
    dispatch({type: "USER_LOADING"});
  
    const token = getState().auth.token;
  
    let headers = {
      "Content-Type": "application/json",
    };
  
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    return api.get("/auth/user/", {headers})
      .then(res => {
        dispatch({type: 'USER_LOADED', user: res.data });
        return res.data;
      })
      .catch(e => {
        if (e.response.status >= 400 && e.response.status < 500) {
          dispatch({type: "AUTHENTICATION_ERROR", data: e.response.data});
          throw e.response.data;
        } else {
          console.log("Server Error!");
          throw e.response;
        }
      })
    }
  }

export const login = (email, password) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let body = JSON.stringify({email, password});

    return api.post("/auth/log_in/", body, {headers})
      .then(res => {
        dispatch({type: 'LOGIN_SUCCESSFUL', data: res.data });
        return res.data;
      })
      .catch(e => {
        if (e.response.status === 403 || e.response.status === 401) {
          dispatch({type: "AUTHENTICATION_ERROR", data: e.response.data});
          throw e.response.data;
        } else {
          dispatch({type: "LOGIN_FAILED", data: e.response.data});
          throw e.response.data;
        }
      })
  }
}

export const loginGoogle = (nombre, email, password, user_type, apellido, id_token) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let body = JSON.stringify({nombre, email, password, user_type, apellido, id_token});

    return api.post("/auth/google/", body, {headers})
      .then(res => {
        dispatch({type: 'LOGIN_SUCCESSFUL', data: res.data });
        return res.data;
      })
      .catch(e => {
        if (e.response.status === 403 || e.response.status === 401) {
          dispatch({type: "AUTHENTICATION_ERROR", data: e.response.data});
          throw e.response.data;
        } else {
          dispatch({type: "LOGIN_FAILED", data: e.response.data});
          throw e.response.data;
        }
      })
  }
}

export const loginFacebook = (nombre, email, password, user_type, apellido, id_token) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let body = JSON.stringify({nombre, email, password, user_type, apellido, id_token});

    return api.post("/auth/facebook/", body, {headers})
      .then(res => {
        dispatch({type: 'LOGIN_SUCCESSFUL', data: res.data });
        return res.data;
      })
      .catch(e => {
        if (e.response.status === 403 || e.response.status === 401) {
          dispatch({type: "AUTHENTICATION_ERROR", data: e.response.data});
          throw e.response.data;
        } else {
          dispatch({type: "LOGIN_FAILED", data: e.response.data});
          throw e.response.data;
        }
      })
  }
}

export const register = (email, password) => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let body = JSON.stringify({email, password});

    return api.post("/auth/sign_up/", body, {headers})
      .then(res => {
        dispatch({type: 'REGISTRATION_SUCCESSFUL', data: res.data });
        return res.data;
      })
      .catch(e => {
        if (e.response.status === 403 || e.response.status === 401) {
          dispatch({type: "AUTHENTICATION_ERROR", data: e.response.data});
          throw e.response.data;
        } else {
          dispatch({type: "REGISTRATION_FAILED", data: e.response.data});
          throw e.response.data;
        }
      })
  }
}

export const logout = () => {
  return (dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};

    return api.post("/auth/logout/", JSON.stringify(""), {headers})
      .then(res => {
        dispatch({type: 'LOGOUT_SUCCESSFUL'});
        return res.data;
      })
      .catch(e => {
        if (e.response.status === 403 || e.response.status === 401) {
          dispatch({type: "AUTHENTICATION_ERROR", data: e.response.data});
          throw e.response.data;
        } else {
          console.log("Server Error!");
          throw e.response;
        }
      })
  }
}