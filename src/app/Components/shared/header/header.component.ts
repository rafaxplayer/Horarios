import { Component, Input } from '@angular/core';
import { FirebaseService } from '../../../Services/firebase.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducers'
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  authState: firebase.User;

  userSubscription: Subscription;

  constructor(private firebaseservice: FirebaseService, private store: Store<AppState>) {
    this.userSubscription = store.select('user')
      .subscribe((user: firebase.User) => this.authState = user);

  }

  login(): void {
    this.firebaseservice.googleLogin();
  }

  logOut(): void {
    this.firebaseservice.signOut();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    
  }

}
