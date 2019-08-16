import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-bemte',
  templateUrl: './header-bemte.component.html',
  styleUrls: ['./header-bemte.component.scss'],
})
export class HeaderBemteComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  goTo(url) {
    console.log(url);
  }
}
