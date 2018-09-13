import { InitialState } from '../../models/Calendar.models';
import * as UserActions from './user.actions';

export type Action = UserActions.ALL;

export function UserReducer(state =  InitialState.user,action:Action){

    switch (action.type) {
        case UserActions.USER:

            return action.payload;
               
        default:
           return state;
    }

}