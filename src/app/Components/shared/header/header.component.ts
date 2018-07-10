import { Component,Input} from '@angular/core';
import { FirebaseService } from '../../../Services/firebase.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() authState:any;

  constructor(private firebaseservice:FirebaseService) {}

  login():void{
    this.firebaseservice.googleLogin();
  }
  
  logOut():void{
    this.firebaseservice.signOut();
  }
  

}
