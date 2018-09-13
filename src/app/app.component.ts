import { Component } from '@angular/core';
import { FirebaseService  } from './Services/firebase.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import swal  from 'sweetalert2';
import { HorariosAction } from './store/horarios/horarios.actions';
import { AppState } from './store/app.reducers';
import { DayTypesListAction } from './store/daytypes/daytypes.actions';
import { UserAction } from './store/user/user.actions';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Worked Hours';

  authUserState:any = null;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
       
       swal({
          title:'Eliminar Horario',
          text:'¿Seguro quieres eliminar este horario?',
          type:'warning',
          showCancelButton:true,
          confirmButtonText: 'SI',
          cancelButtonText: 'CANCELAR',
          reverseButtons: true
          })
          .then((willdelete)=>{
            if(willdelete.value){
              this.firebaseService.deleteHorario(event);
              swal("Ok!"," Horario eliminado con exito!","success");
            } 
        });
        
      }
    }
  ];

  constructor(private firebaseService:FirebaseService,private _router:Router, private store:Store<AppState>){
    
    this.firebaseService.currentUserObservable().subscribe(user => {
      
      if(!user){
        this._router.navigate(['notlogin']);
      }else{
        if(this._router.url.indexOf('notlogin')!= -1){
          this._router.navigate(['home']);
        }
      }

      const action = new UserAction(user);
      store.dispatch(action);

    });

    //store.subscribe(state=>console.log(state));

    this.firebaseService.getHorarios().snapshotChanges().subscribe(item => {
      let events = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["start"] = new Date(x["start"]);
          x["end"] = new Date(x["end"]); 
          x["actions"] = this.actions;
          events.push(x as CalendarEvent);
          
        }); 
        const action = new HorariosAction(events);
        store.dispatch(action); 
                
    });

    this.firebaseService.getDayTypes().snapshotChanges().subscribe(item => {
      let daytypes=[];
        item.forEach(element => {
             daytypes.push(element.payload.val());
        }); 

        const action = new DayTypesListAction(daytypes);
        store.dispatch(action); 
                
    }); 

   
  }
  

   
}
