import { Injectable } from '@angular/core';
import { createWriteStream } from 'fs';
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
    console.log(this.resultFilms)
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

  getFilmsByDateVision(year: string, tab: any[]) {
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

  async getFilmsByRealisator(real: string) {
    try {
      const personResponse = await this.api.getPerson(real).toPromise();
      const realisators_id = (personResponse as any).results[0].id;
      const moviesResponse = await this.api.getMoviesByRealisatorIdAllPages(realisators_id);
      const temp = new Map<string, number>();
      for (let i = 0; i < (moviesResponse as any).length; i++) {
        const movie = (moviesResponse as any)[i];
        temp.set(movie.title, movie.id);
      }
      return temp;
    } catch (error) {
      console.error(`Error getting films by director: ${error}`);
      return new Map<string, number>();
    }
  }

  async getFilmsByActor(actors: string) {
    try {
      let tab_actors = actors.split(",");
      let actors_id = "";

      for (let i = 0; i < tab_actors.length; i++) {
        const personResponse = await this.api.getPerson(tab_actors[i]).toPromise();
        const id = (personResponse as any).results[0].id;
        actors_id += id + ",";
      }
      actors_id = actors_id.slice(0, -1);
      console.log(actors_id)
      const moviesResponse = await this.api.getMoviesByActorIdAllPages(actors_id);
      const temp = new Map<string, number>();
      for (let i = 0; i < (moviesResponse as any).length; i++) {
        const movie = (moviesResponse as any)[i];
        temp.set(movie.title, movie.id);
      }

      return temp;
    } catch (error) {
      console.error(`Error getting films by actor(s): ${error}`);
      return new Map<string, number>();
    }
  }

  async getMoviesByYearAndRealisator(year: string, real: string) {
    try {
      const personResponse = await this.api.getPerson(real).toPromise();
      console.log(personResponse)
      const realisators_id = (personResponse as any).results[0].id;
      const moviesResponse = await this.api.getMoviesByYearAndRealisatorAllPages(year, realisators_id)
      const temp = new Map<string, number>();
      for (let i = 0; i < (moviesResponse as any).length; i++) {
        const movie = (moviesResponse as any)[i];
        temp.set(movie.title, movie.id);
      }
      return temp;
    } catch (error) {
      console.error(`Error getting films by director and year: ${error}`);
      return new Map<string, number>();
    }
  }

  async getMoviesByYearAndActors(year: string, actors: string) {
    try {
      let tab_actors = actors.split(",");
      let actors_id = "";

      for (let i = 0; i < tab_actors.length; i++) {
        const personResponse = await this.api.getPerson(tab_actors[i]).toPromise();
        const id = (personResponse as any).results[0].id;
        actors_id += id + ",";
      }
      actors_id = actors_id.slice(0, -1);
      console.log(actors_id)
      const moviesResponse = await this.api.getMoviesByYearAndActorsAllPages(year, actors_id)
      const temp = new Map<string, number>();
      for (let i = 0; i < (moviesResponse as any).length; i++) {
        const movie = (moviesResponse as any)[i];
        temp.set(movie.title, movie.id);
      }
      console.log(temp)
      return temp;
    } catch (error) {
      console.error(`Error getting films by actor(s) and year: ${error}`);
      return new Map<string, number>();
    }
  }

  async getMoviesByActorsAndRealisator(actors: string, real: string) {
    try {
      let tab_actors = actors.split(",");
      let actors_id = "";

      for (let i = 0; i < tab_actors.length; i++) {
        const personResponse = await this.api.getPerson(tab_actors[i]).toPromise();
        const id = (personResponse as any).results[0].id;
        actors_id += id + ",";
      }
      actors_id = actors_id.slice(0, -1);
      console.log(actors_id)
      const personResponse = await this.api.getPerson(real).toPromise();
      const realisators_id = (personResponse as any).results[0].id;
      const moviesResponse = await this.api.getMoviesByActorsAndRealisatorAllPages(actors_id, realisators_id)
      const temp = new Map<string, number>();
      for (let i = 0; i < (moviesResponse as any).length; i++) {
        const movie = (moviesResponse as any)[i];
        temp.set(movie.title, movie.id);
      }
      console.log(temp)
      return temp;
    } catch (error) {
      console.error(`Error getting films by actor(s) and director: ${error}`);
      return new Map<string, number>();
    }
  }

  async getMoviesByYearAndActorsAndRealisator(year: string, actors: string, real: string) {
    try {
      let tab_actors = actors.split(",");
      let actors_id = "";

      for (let i = 0; i < tab_actors.length; i++) {
        const personResponse = await this.api.getPerson(tab_actors[i]).toPromise();
        const id = (personResponse as any).results[0].id;
        actors_id += id + ",";
      }
      actors_id = actors_id.slice(0, -1);
      console.log(actors_id)
      const personResponse = await this.api.getPerson(real).toPromise();
      const realisators_id = (personResponse as any).results[0].id;
      const moviesResponse = await this.api.getMoviesByYearAndActorsAndRealisatorAllPages(year, actors_id, realisators_id)
      const temp = new Map<string, number>();
      for (let i = 0; i < (moviesResponse as any).length; i++) {
        const movie = (moviesResponse as any)[i];
        temp.set(movie.title, movie.id);
      }
      console.log(temp)
      return temp;
    } catch (error) {
      console.error(`Error getting films by actor(s), director and year: ${error}`);
      return new Map<string, number>();
    }
  }


}
