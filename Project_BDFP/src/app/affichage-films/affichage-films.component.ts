import { Component, OnInit } from '@angular/core';
import { Film } from 'app/models/film.model';
import { InitService } from 'services/init.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-affichage-films',
  templateUrl: './affichage-films.component.html',
  styleUrls: ['./affichage-films.component.scss'],
})
export class AffichageFilmsComponent implements OnInit {
  films: Film[] = [];

  filmsWithAPI: any[] = [];

  movies: Map<any, any> = new Map();
  singleFilm: Map<any, string> = new Map();
  idActor: number = 0;
  moviesNumber: number = 0;
  noPoster: boolean = false;
  fromTMDB: boolean = true;
  searchText!: any;

  constructor(
    private init: InitService,
  ) {}

  ngOnInit(): void {
    this.initialisation()
  }

  async initialisation(){
    this.movies = await this.init.initAffichageFilms()
  }
}
