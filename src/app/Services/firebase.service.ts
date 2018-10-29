
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth';
import { auth ,User} from 'firebase/app';
import { CalendarEvent } from 'angular-calendar';
import { Router } from "@angular/router";
import { Daytype } from '../interfaces/app.interfaces';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducers';
import { UserAction } from '../store/user/user.actions';
import { HorariosAction } from '../store/horarios/horarios.actions'
import { DayTypesListAction } from '../store/daytypes/daytypes.actions'
import swal from 'sweetalert2';
import { CalendarEventAction } from 'angular-calendar';

@Injectable()
export class FirebaseService {

  horarios: AngularFireList<any>;

  tipos_dia: AngularFireList<any>;

  authState: User = null;

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
              this.deleteHorario(event);
              swal("Ok!"," Horario eliminado con exito!","success");
            } 
        });
        
      }
    }
  ];
    
  constructor(private firebaseDatabase:AngularFireDatabase, 
              private firebaseAuth:AngularFireAuth,
              private firestoreDatabase:AngularFirestore, 
              private router:Router,
              private store:Store<AppState> ) {}

  
//init services
  initializeAuth(){
    this.firebaseAuth.authState.subscribe((auth) => {
      this.authState = auth;
      const action = new UserAction(auth);
      this.store.dispatch(action);
      
    });
  }

  initializeHorarios(){
    this.getHorarios().snapshotChanges().subscribe(item => {
      let events = [];
        item.forEach(element => {
          let x = element.payload.toJSON();
          x["start"] = new Date(x["start"]);
          x["end"] = new Date(x["end"]); 
          x["actions"] = this.actions;
          events.push(x as CalendarEvent);
          
        }); 
        const action = new HorariosAction(events);
        this.store.dispatch(action); 
                
    })
  }

  initializeTiposDia(){
    this.getDayTypes().snapshotChanges().subscribe(item => {
      let daytypes=[];
        item.forEach(element => {
             daytypes.push(element.payload.val());
        }); 

        const action = new DayTypesListAction(daytypes);
        this.store.dispatch(action); 
                
    });  
  }


  //Authentification
  // Returns true if user is logged in
   authenticated() {
    this.authState != null;
  }

  // Returns current user data
  currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  currentUserObservable(): any {
    return this.firebaseAuth.authState
  }

  // Returns current user UID
  currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.firebaseAuth.auth.signInWithPopup(provider)
      .then((credential) =>  {
          this.authState = credential.user
      })
      .catch(error => console.log(error));
  }

 // Sign Out //
  signOut(): void {
    this.firebaseDatabase.createPushId
    this.firebaseAuth.auth.signOut();
    this.router.navigate(['/notLogin'])
  }

  pushId(){
    return this.firebaseDatabase.createPushId();
  }

  //DataBase
  getHorarios(){
    return this.horarios = this.firebaseDatabase.list('horarios');
  }
      
  addHorario( horario:CalendarEvent){

    horario.meta.id = this.firebaseDatabase.createPushId();
    let newData = JSON.stringify(horario);
    this.firestoreDatabase.doc(`${this.authState.uid.toString()}/horarios`).set(JSON.parse(newData))
        .then(()=>console.log('ok'))
    
    return this.horarios.set(horario.meta.id,JSON.parse(newData));
    
  }

  deleteHorario(horario:CalendarEvent){
    this.horarios.remove(horario.meta.id);
  }

  getDayTypes(){
    return this.tipos_dia = this.firebaseDatabase.list('tipos_dia');
  }

  addDayType( daytype:Daytype, date:Date){
    daytype.date = date.toDateString();
    let newData = JSON.stringify(daytype);
    console.log(daytype);
    
    return this.tipos_dia.set(daytype.date,JSON.parse(newData));
    
  }

}