import { Component } from '@angular/core';
import { FirebaseService  } from './Services/firebase.service';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import swal  from 'sweetalert2';
import { AppState } from './store/app.reducers';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Worked Hours';

  userSubscription:Subscription;
  
  constructor(private firebaseService:FirebaseService,private _router:Router, private store:Store<AppState>){
    
    this.firebaseService.initializeAuth();
    this.firebaseService.initializeHorarios();
    this.firebaseService.initializeTiposDia();

    this.userSubscription = store.select('user').subscribe((user:firebase.User) => {
      if(!user){
        this._router.navigate(['notlogin']);
      }else{
        if(this._router.url.indexOf('notlogin') != -1){
          this._router.navigate(['home']);
        }
      } 
    });

     
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    
  }
     
}
