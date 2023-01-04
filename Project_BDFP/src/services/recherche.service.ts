import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { FilmsService } from './films.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class RechercheService {

  filmsAPI!: Array<any>;

  resultFilms: any[] = [];

  temp: any;

  constructor(
    private utilService: UtilsService,
    private api: ApiServiceService
  ) {}

  getFilmsByTitre(titre: string, tab: any[]){
    this.resultFilms = tab;
    this.filmsAPI = this.utilService.getListOfFilms();
    let reg = new RegExp(titre);
    if (this.resultFilms.length != 0) {
      for (let i = 0; i < this.resultFilms.length; i++) {
        if (!reg.test(this.resultFilms[i].titre)) {
          this.resultFilms.splice(i, 1);
          i--;
        }
      }
    } else {
      for (let i = 0; i < this.filmsAPI.length; i++) {
        if (reg.test(this.filmsAPI[i].titre)) {
          this.resultFilms.push(this.filmsAPI[i]);
        }
      }
    }
    return this.resultFilms;
  }

  getFilmsByActor(actors: string, tab: any[]) {
    this.resultFilms = tab;
    this.filmsAPI = this.utilService.getListOfFilms();
    let reg = new RegExp(actors);
    if (this.resultFilms.length != 0) {
      for (let i = 0; i < this.resultFilms.length; i++) {
        this.api
          .getMovieById(this.resultFilms[i].omdbID)
          .subscribe((unFilm) => {
            this.temp = unFilm;
            if (!reg.test(this.temp.Actors)) {
              this.resultFilms.splice(i, 1);
              i--;
            }
          });
      }
    } else {
      for (let i = 0; i < this.filmsAPI.length; i++) {
        this.api.getMovieById(this.filmsAPI[i].omdbID).subscribe((unFilm) => {
          this.temp = unFilm;
          if (reg.test(this.temp.Actors)) {
            this.resultFilms.push(this.filmsAPI[i]);
          }
        });
      }
    }
    return this.resultFilms;
  }

  getFilmsByLocation(loc: string, tab: any[]) {
    this.resultFilms = tab;
    this.filmsAPI = this.utilService.getListOfFilms();
    let reg = new RegExp(loc);
    if (this.resultFilms.length != 0) {
      for (let i = 0; i < this.resultFilms.length; i++) {
        if (!reg.test(this.resultFilms[i].cinema)) {
          this.resultFilms.splice(i, 1);
          i--;
        }
      }
    } else {
      for (let i = 0; i < this.filmsAPI.length; i++) {
        if (reg.test(this.filmsAPI[i].cinema)) {
          this.resultFilms.push(this.filmsAPI[i]);
        }
      }
    }
    return this.resultFilms;
  }

  getFilmsByAccompagnateurs(acc: string, tab: any[]) {
    this.resultFilms = tab;
    this.filmsAPI = this.utilService.getListOfFilms();
    let reg = new RegExp(acc);
    if (this.resultFilms.length != 0) {
      for (let i = 0; i < this.resultFilms.length; i++) {
        if (reg.test(this.resultFilms[i].accompagnateurs)) {
        } else {
          this.resultFilms.splice(i, 1);
          i--;
        }
      }
    } else {
      for (let i = 0; i < this.filmsAPI.length; i++) {
        if (reg.test(this.filmsAPI[i].accompagnateurs)) {
          this.resultFilms.push(this.filmsAPI[i]);
        }
      }
    }
    return this.resultFilms;
  }

  getFilmsByYear(year: string, tab: any[]) {
    this.resultFilms = tab;
    this.filmsAPI = this.utilService.getListOfFilms();
    let reg = new RegExp(year);
    if (this.resultFilms.length != 0) {
      for (let i = 0; i < this.resultFilms.length; i++) {
        if (!reg.test(this.resultFilms[i].dateVision)) {
          this.resultFilms.splice(i, 1);
          i--;
        } 
      }
    } else {
      for (let i = 0; i < this.filmsAPI.length; i++) {
        if (reg.test(this.filmsAPI[i].dateVision)) {
          this.resultFilms.push(this.filmsAPI[i]);
        }
      }
    }
    return this.resultFilms;
  }

  getFilmsByRealisator(real: string, tab: any[]) {
    this.resultFilms = tab
    this.filmsAPI = this.utilService.getListOfFilms();
    let reg = new RegExp(real);
    if (this.resultFilms.length != 0) {
      for (let i = 0; i < this.resultFilms.length; i++) {
        this.api
          .getMovieById(this.resultFilms[i].omdbID)
          .subscribe((unFilm) => {
            this.temp = unFilm;
            if (!reg.test(this.temp.Director)) {
              this.resultFilms.splice(i, 1);
              i--;
            }
          });
      }
    } else {
      for (let i = 0; i < this.filmsAPI.length; i++) {
        this.api.getMovieById(this.filmsAPI[i].omdbID).subscribe((unFilm) => {
          this.temp = unFilm;
          if (reg.test(this.temp.Director)) {
            this.resultFilms.push(this.filmsAPI[i]);
          }
        });
      }
    }
    return this.resultFilms;
  }
}
