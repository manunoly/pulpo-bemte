import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bemte',
  templateUrl: './header-bemte.component.html',
  styleUrls: ['./header-bemte.component.scss'],
})
export class HeaderBemteComponent implements OnInit {
  estado = 'Disponible';

  constructor(private router: Router) { }

  ngOnInit() { }

  goTo(url) {
    this.router.navigateByUrl(url);
  }

  actualizarEstado($event) {
    if ($event)
      this.estado = 'Disponible';
    else
      this.estado = 'Ocupado';
  }
}
