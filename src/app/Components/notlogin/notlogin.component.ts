import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../Services/firebase.service';


@Component({
  selector: 'app-notlogin',
  templateUrl: './notlogin.component.html',
  styleUrls: ['./notlogin.component.css']
})
export class NotloginComponent implements OnInit {

  errormsg:string;

  constructor(private _router:Router,private firebaseservice:FirebaseService) { }
  //this._router.navigate(['home']);
  ngOnInit() {
    
      if(this.firebaseservice.authenticated()){
        
      }
    
    
  }

  goHome(){
    if(this.firebaseservice.authenticated()){
      this._router.navigate(['home']);
    }else{
      this.errormsg = "Error: No tienes acceso a esa pagina , debes autenticarte";
    }

  }

}
