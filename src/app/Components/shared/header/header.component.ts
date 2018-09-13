import { Component,Input} from '@angular/core';
import { FirebaseService } from '../../../Services/firebase.service';
import { Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  authState:any;

  constructor(private firebaseservice:FirebaseService,private store:Store<AppState>) {
    store.select('user').subscribe(user => this.authState = user);
  }

  login():void{
    this.firebaseservice.googleLogin();
  }
  
  logOut():void{
    this.firebaseservice.signOut();
  }
  

}
