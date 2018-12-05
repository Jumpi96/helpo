const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: true,
  isVerificationError: false,
  // Agrego un id imposible para que haya algo, asi los componentes que busquen este valor
  // no exploten por estar undefined cunado no haya usuario logeado
  user: { id: -1 }, 
  errors: {},
};

export default function auth(state=initialState, action) {
  switch (action.type) {
    case 'USER_LOADING':
      return {...state, isLoading: true};
    case 'USER_LOADED':
      return {...state, isAuthenticated: true, isLoading: false, user: action.user};
    case 'LOGIN_SUCCESSFUL':
      localStorage.setItem("token", action.data.token);
      return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};
    case 'AUTHENTICATION_ERROR':
      localStorage.removeItem("token");
      return {...state, errors: null, token: null, user: initialState.user,
        isAuthenticated: false, isLoading: false, isVerificationError: false};
    case 'LOGIN_FAILED':
      return {...state, isVerificationError: false, errors: {detail: 'Los datos ingresados no son correctos.'}};
    case 'LOGIN_UNVERIFIED':
      return {...state, isVerificationError: true, errors: {detail: 'Debe verificar su cuenta.'}}
    case 'REGISTRATION_FAILED':
    case 'LOGOUT_SUCCESSFUL':
      localStorage.removeItem("token");
      return {...state, errors: action.data, token: null, user: initialState.user,
        isAuthenticated: false, isLoading: false, isVerificationError: false};
    default:
      return state;
    }
}