import { IUser } from './user';
export interface ILogin {
  email: string;
  password: string;
}

export interface IAuthentication {
  user: IUser;
  authToken: string;
}
