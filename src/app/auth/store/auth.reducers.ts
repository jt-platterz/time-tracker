import { IAuthState } from './auth.state';
import { AuthAction, AuthActions } from './auth.actions';

const DEFAULT_STATE = {
  authToken: null,
  initialized: false,
  user: null,
  error: null
};

export function authReducer(state: IAuthState = DEFAULT_STATE, action: AuthAction): IAuthState {
  switch (action.type) {
    case AuthActions.Login:
      return {
        ...state,
        error: null
      };

    case AuthActions.LoginSuccess:
      localStorage.setItem('authToken', action.authToken);

      return {
        ...state,
        authToken: action.authToken,
        user: action.user
      };

    case AuthActions.LoginFailure:
      return {
        ...state,
        error: action.error
      };

    case AuthActions.Logout:
      return {
        ...state,
        user: null,
        authToken: null,
        error: null
      };

    case AuthActions.InitializeComplete:
      return {
        ...state,
        user: action.user,
        authToken: action.authToken,
        initialized: true,
        error: null
      };

    default:
      return {
        ...state,
        authToken: localStorage.getItem('authToken')
      };
  }
}
