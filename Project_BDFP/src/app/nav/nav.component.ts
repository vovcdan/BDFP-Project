import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FilmsService } from 'services/films.service';
import { interval } from 'rxjs';
import { TokenService } from 'services/token.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  // si utilisateur est dans home
  home: boolean = false;

  // si utilisateur est dans favoris
  favs: boolean = false;

  // formulaire
  snapForm!: FormGroup;

  // signale si l'utilisateur est connecté ou non
  isSign: boolean = false;

  // vàribale qui contient le mail utilisateur
  userName!: string;

  // subscriber chaque seconde
  data$ = interval(1000);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private filmService: FilmsService,
              private tok: TokenService,
              private utilService: UtilsService,
              ) { }

  /*
  * utilise reload() chaque seconde pour vérifier si l'utilisateur est connecté
  * initialise le formulaire
  */
  ngOnInit() {
    this.data$.subscribe(
      value => this.reload());

    this.snapForm = this.formBuilder.group({
      title:[null],
      destription:[null],
      imageUrl:[null],
      location: [null]
    });

  }

  // vérifie si l'utilisateur est connecté
  // si connecté -> récupère son nom localement
  reload() {
    if(this.utilService.isConnected()) {
      this.isSign = true;
      this.userName = this.utilService.getUserName();
    } else {
      this.isSign = false;
    }
  }

  // déconnecte l'utilisateur -> oublie sont mail -> redirige vers home
  disconnect() {
    this.isSign = false;
    this.utilService.disconnect();
    this.tok.disconnect();
    this.utilService.setUserName('');
    this.router.navigateByUrl('/connect');
    this.utilService.setUserId('');
  }
}
