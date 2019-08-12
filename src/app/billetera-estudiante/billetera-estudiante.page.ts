import { Router } from '@angular/router';
import { AuthService } from './../servicios/auth.service';
import { DbService } from './../servicios/db.service';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-billetera-estudiante',
  templateUrl: './billetera-estudiante.page.html',
  styleUrls: ['./billetera-estudiante.page.scss'],
})
export class BilleteraEstudiantePage implements OnInit {
  horasCombos;

  constructor(private router: Router, public auth: AuthService, private db: DbService) { }

  ngOnInit() {
    this.horasCombos = this.auth.user.pipe(
      switchMap(user => {
        if (user)
          return this.db.get('horas-alumno?user_id=' + user.user_id);
        return of(null)
      }
      ));
  }

  recargarCombos(){
    this.db.setComboToBuy('');
    this.router.navigateByUrl('combos');
  }
}
