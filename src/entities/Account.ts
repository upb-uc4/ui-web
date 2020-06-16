import { Roles } from './Role';
export class Account {
    username: string= "";
    password: string="";
    role: Roles = Roles.NONE;
}