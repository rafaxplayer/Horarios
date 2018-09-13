import { Daytype } from '../interfaces/app.interfaces';
import { AppState } from '../store/app.reducers';

  export class DayType{
    color:string;
    value:string;
    label:string;
    constructor(color,label,value,){
      this.color=color;
      this.label=label;
      this.value=value;
    }
  }

  export const dayTypesModel:Daytype[]=[
    {
      color:'whiteday',
      value:'worked',
      label:'Trabajado',
    },
    {
      color:'blueday',
      value:'holidays',
      label:'Vacaciones',
    },{
      color:'greenday',
      value:'free',
      label:'Fiesta',
    }
  ]

  export const InitialState:AppState ={
    horarios:[],
    user:null,
    dayTypes:{
        list:[],
        select:dayTypesModel[0]
    }
    
}