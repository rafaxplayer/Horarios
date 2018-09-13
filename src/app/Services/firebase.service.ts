
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { CalendarEvent } from 'angular-calendar';
import { Router } from "@angular/router";
import { Daytype } from '../interfaces/app.interfaces';

@Injectable()
export class FirebaseService {

  horarios: AngularFireList<any>;

  tipos_dia: AngularFireList<any>;

  authState: any = null;
    
  constructor( private firebaseDatabase:AngularFireDatabase, private firebaseAuth:AngularFireAuth, private router:Router  ) { 
    this.firebaseAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  //Authentification

  // Returns true if user is logged in
   authenticated(): boolean {
    return this.authState !== null;
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