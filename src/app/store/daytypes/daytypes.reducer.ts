import { InitialState } from '../../models/Calendar.models';
import * as DayTypesActions from './daytypes.actions';

export type Action = DayTypesActions.ALL;

export function DayTypesReducer(state =  InitialState.dayTypes, action:Action){

    switch (action.type) {
        case DayTypesActions.DAYTYPES_LIST:

            return { ...state, list:action.payload  }

        case DayTypesActions.DAYTYPES_SELECT:

            return { ...state, select:action.payload  }
               
        default:
           return state;
    }

}