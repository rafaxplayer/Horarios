
import { CalendarEvent } from 'angular-calendar';
import { Daytype } from '../interfaces/app.interfaces';
import { ActionReducerMap } from '@ngrx/store';
import { HorariosReducer } from './horarios/horarios.reducers';
import { DayTypesReducer } from './daytypes/daytypes.reducer';
import { UserReducer } from './user/user.reducer';
import { dayTypesModel } from '../models/Calendar.models';


export interface AppState{
    horarios:CalendarEvent[];
    user:any,
    dayTypes:{
        list:Daytype[],
        select:Daytype
    }
   
}


export const AppReducers :ActionReducerMap<AppState>={
    horarios:HorariosReducer,
    user:UserReducer,
    dayTypes:DayTypesReducer

}


