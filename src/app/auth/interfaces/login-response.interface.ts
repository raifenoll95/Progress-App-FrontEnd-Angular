import { User } from "./user.interface";


export interface Response {
  user:  User;
  token: string;
}
