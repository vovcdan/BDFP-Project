import { Component, OnInit, ViewChild } from '@angular/core';
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
  spinner : boolean = false



  constructor(
    private init: InitService,
  ) {}

  ngOnInit(): void {
    this.initialisation()
  }

  async initialisation(){
    this.spinner = true
    this.movies = await this.init.initAffichageFilms()
    this.spinner = false
  }

  get spinnerStyle() { return {color: 'Orange'} }

  get filteredMovies() {
    if (!this.searchText) {
      return this.movies;
    }
    return new Map([...this.movies].filter(([key, movie]) => {
      const titleMatch = movie.title.toLowerCase().includes(this.searchText.toLowerCase());
      const releaseDateMatch = movie.release_date.includes(this.searchText);
      return titleMatch || releaseDateMatch;
    }));
  }

}
