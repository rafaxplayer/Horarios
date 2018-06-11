import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `<header><img class="logo" src="../../../assets/img/logo.png"/><h1 class='site-title'>Work Hours</h1></header>`,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
