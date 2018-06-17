import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth ,Observer} from 'firebase/app';
import { CalendarEvent } from 'angular-calendar';

import { Router } from "@angular/router";


@Injectable()
export class FirebaseService {

  horarios: AngularFireList<any>;

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

 //// Sign Out ////
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
    let newHorario = JSON.stringify(horario);
    let ref = this.horarios.set(horario.meta.id,JSON.parse(newHorario));
    
  }

  deleteHorario(horario:CalendarEvent){
    this.horarios.remove(horario.meta.id);
  }
}
