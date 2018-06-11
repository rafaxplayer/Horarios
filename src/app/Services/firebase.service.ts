import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { CalendarEvent } from 'angular-calendar';
import { Observable } from 'rxjs';

@Injectable()
export class FirebaseService {

  horarios: AngularFireList<any>;
    
  constructor( private firebase:AngularFireDatabase ) { }

  getHorarios(){
  
    return this.horarios = this.firebase.list('horarios');

  }
      
  addHorario( horario:CalendarEvent){
    
    let newHorario = JSON.stringify(horario);
    
   this.horarios.push(JSON.parse(newHorario));
    
  }

  deleteHorario(horario:CalendarEvent){
    this.horarios.remove(horario.meta.id);
  }
}
