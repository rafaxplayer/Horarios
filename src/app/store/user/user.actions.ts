import { Action } from '@ngrx/store';

export const USER = '[USER] user'

export class UserAction implements Action{

    readonly type = USER;
    constructor(public payload:any){}
}

export type ALL = UserAction;