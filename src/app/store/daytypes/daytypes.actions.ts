import { Action } from '@ngrx/store';
import { Daytype } from '../../interfaces/app.interfaces';

export const DAYTYPES_LIST = '[DAYTYPE] list'
export const DAYTYPES_SELECT = '[DAYTYPE] select'

export class DayTypesListAction implements Action{

    readonly type = DAYTYPES_LIST;
    constructor(public payload:Daytype[]){}
}

export class DayTypesSelectAction implements Action{

    readonly type = DAYTYPES_SELECT;
    constructor(public payload:Daytype){}
}

export type ALL = DayTypesListAction | DayTypesSelectAction;