import { IUser } from '../user';
export const AUTH_STATE_NAME = 'auth';

export interface IAuthState {
  initialized: boolean;
  user: IUser;
  authToken: string;
  error: string;
}
