import { Component } from '@angular/core';
import { FirebaseService  } from './Services/firebase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Worked Hours';

  authUserState:any = null;

  constructor(private firebaseService:FirebaseService,private _router:Router){
    //this.authUserState = firebaseService.currentUser();
    this.firebaseService.currentUserObservable().subscribe(user => {
      this.authUserState = user;
      if(!this.authUserState){
        this._router.navigate(['notlogin']);
      }else{
        if(this._router.url.indexOf('notlogin')!= -1){
          this._router.navigate(['home']);
        }
      }

    });
  }
  

   
}
