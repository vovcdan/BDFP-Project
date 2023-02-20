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
    let tab_actors = actors.split(",");
    let promises: any[] = [];

    tab_actors.forEach(actor => {
      promises.push(this.api.getPerson(actor).toPromise());
    });

    Promise.all(promises).then((acts: any[]) => {
      let actors_id = "";
      acts.forEach((act: any) => {
        actors_id += act.results[0].id + ",";
      });
      actors_id = actors_id.slice(0, -1);
      console.log(actors_id);
      this.api.getMoviesByActorId(actors_id).subscribe((movies: any) => {
        console.log(movies);
      });
    });
  
    // if (this.resultFilms.length != 0) {
    //   for (let i = 0; i < this.resultFilms.length; i++) {
    //     this.api
    //       .getMovieById(this.resultFilms[i].omdbID)
    //       .subscribe((unFilm) => {
    //         this.temp = unFilm;
    //         if (!reg.test(this.temp.Actors)) {
    //           this.resultFilms.splice(i, 1);
    //           i--;
    //         }
    //       });
    //   }
    // } else {
    //   for (let i = 0; i < this.filmsAPI.length; i++) {
    //     this.api.getMovieById(this.filmsAPI[i].omdbID).subscribe((unFilm) => {
    //       this.temp = unFilm;
    //       if (reg.test(this.temp.Actors)) {
    //         this.resultFilms.push(this.filmsAPI[i]);
    //       }
    //     });
    //   }
    // }
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
    this.api.getPerson(real).subscribe((unReal: any) => {
      this.api.getMoviesByRealisatorId(unReal.results[0].id).subscribe((movies: any) => {
        console.log(movies.results[0].title)
        for (let i = 0; i < movies.results.length; i++) {
          this.resultFilms.push(movies.results[i].title)
        }
        console.log(this.resultFilms)
        // for (let i = 0; i < movies.length; i++) {
        //   this.resultFilms.push(movies.results[i].title)
        // }
        // console.log(this.resultFilms)
      })
    })
    // for (let i = 0; i < this.filmsAPI.length; i++) {
    //   this.api.getMovieTMDBByIMDBID(this.filmsAPI[i].omdbID).subscribe((unFilm: any) => {
    //     console.log(unFilm)
    //     this.api.getCastTMDB(unFilm['movie_results'][0].id).subscribe((unCast: any) => {
    //       console.log(unCast)
    //       console.log(unCast.crew.filter((crew: any) => crew.job == "Director")[0].name)
    //     })
    //   })
    // }
    // if (this.resultFilms.length != 0) {
    //   for (let i = 0; i < this.resultFilms.length; i++) {
    //     this.api
    //       .getMovieById(this.resultFilms[i].omdbID)
    //       .subscribe((unFilm) => {
    //         this.temp = unFilm;
    //         if (!reg.test(this.temp.Director)) {
    //           this.resultFilms.splice(i, 1);
    //           i--;
    //         }
    //       });
    //   }
    // } else {
    //   for (let i = 0; i < this.filmsAPI.length; i++) {
    //     this.api.getMovieById(this.filmsAPI[i].omdbID).subscribe((unFilm) => {
    //       this.temp = unFilm;
    //       if (reg.test(this.temp.Director)) {
    //         this.resultFilms.push(this.filmsAPI[i]);
    //       }
    //     });
    //   }
    // }
    return this.resultFilms;
  }
}
