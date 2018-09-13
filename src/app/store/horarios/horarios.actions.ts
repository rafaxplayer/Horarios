import { Daytype } from '../../interfaces/app.interfaces';
import { CalendarEvent } from 'angular-calendar';
import { Action } from '@ngrx/store';

export const HORARIOS = '[horarios] list';
export const USER = '[user] add';
export const DAYTYPE = '[tipos_dia] select';
export const DAYTYPES = '[tipos_dia] list';

export class HorariosAction implements Action{

    readonly type = HORARIOS;
    constructor(public payload:CalendarEvent[]){}
}


export type ALL = HorariosAction;

