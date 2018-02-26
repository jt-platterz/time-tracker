import { IUser } from '../user';
export enum AuthActions {
  Login = '[AUTH] Login',
  LoginSuccess = '[AUTH] Login Success',
  LoginFailure = '[AUTH] Login Failure',

  Logout = '[AUTH] Logout',

  Initialize = '[AUTH] Initialize',
  InitializeComplete = '[AUTH] Initialize Complete'
}

export interface IAuthLoginAction {
  type: AuthActions.Login;
  email: string;
  password: string;
}
export function authLogin(email: string, password: string): IAuthLoginAction {
  return { email, password, type: AuthActions.Login };
}

export interface IAuthLoginSuccessAction {
  type: AuthActions.LoginSuccess;
  user: IUser;
  authToken: string;
}
export function authLoginSuccess(user: IUser, authToken: string): IAuthLoginSuccessAction {
  return { user, authToken, type: AuthActions.LoginSuccess };
}

export interface IAuthLoginFailureAction {
  type: AuthActions.LoginFailure;
  error: string;
}
export function authLoginFailure(error: string): IAuthLoginFailureAction {
  return { error, type: AuthActions.LoginFailure };
}

export interface IAuthLogoutAction {
  type: AuthActions.Logout;
}
export function authLogout(): IAuthLogoutAction {
  return { type: AuthActions.Logout };
}

export interface IAuthLoginInitializeAction {
  type: AuthActions.Initialize;
}
export function authInitialize(): IAuthLoginInitializeAction {
  return { type: AuthActions.Initialize };
}

export interface IAuthInitializeCompleteAction {
  type: AuthActions.InitializeComplete;
  user: IUser;
  authToken: string;
}
export function authInitializeComplete(user: IUser, authToken: string): IAuthInitializeCompleteAction {
  return { user, authToken, type: AuthActions.InitializeComplete };
}

export type AuthAction
  = IAuthLoginAction
  | IAuthLoginSuccessAction
  | IAuthLoginFailureAction
  | IAuthLogoutAction
  | IAuthLoginInitializeAction
  | IAuthInitializeCompleteAction;
