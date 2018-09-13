import { InitialState } from '../../models/Calendar.models';
import * as HorariosActions from './horarios.actions';

export type Action = HorariosActions.ALL;

export function HorariosReducer(state = InitialState.horarios, action:Action){

    switch(action.type){
        case HorariosActions.HORARIOS:

            //return Object.assign({},state ,{ horariosList:action.payload } );
            return action.payload 

        default:
            return state;

    }
}