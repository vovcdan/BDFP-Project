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

  // getFilmsByYear(year: string, tab: any[]){
  //   this.resultFilms = tab;
  //   this.api.getMoviesByYear(year).subscribe((movies: any) => {
  //     for (let i = 0; i < movies.results.length; i++) {
  //       this.resultFilms.push([movies.results[i].title, movies.results[i].id])
  //     }
  //   })
  //   return this.resultFilms;
  // }

  async getFilmsByYear(year: string, tab: any[]) {
    this.resultFilms = tab;
    this.api.getMoviesByYear(year).subscribe((movies: any) => {
      for (let i = 0; i < movies.results.length; i++) {
        this.resultFilms.push([movies.results[i].title, movies.results[i].id])
      }
    })
    console.log(this.resultFilms)
    return this.resultFilms;
  }

  // getFilmsByRealisator(real: string, tab: any[]) {
  //   this.resultFilms = tab
  //   this.api.getPerson(real).subscribe((unReal: any) => {
  //     this.api.getMoviesByRealisatorId(unReal.results[0].id).subscribe((movies: any) => {
  //       for (let i = 0; i < movies.results.length; i++) {
  //         this.resultFilms.push([movies.results[i].title, movies.results[i].id])
  //       }
  //     })
  //   })
  //   console.log(this.resultFilms)
  //   return this.resultFilms;
  // }

  async getFilmsByRealisator(real: string, tab: any[]) {
    this.resultFilms = tab;
    let promises: any[] = [];

    promises.push(this.api.getPerson(real).toPromise());

    await Promise.all(promises).then((reals: any[]) => {
      let realisators_id = "";
      reals.forEach((real: any) => {
        realisators_id += real.results[0].id + ",";
      });
      realisators_id = realisators_id.slice(0, -1);
      this.api.getMoviesByRealisatorId(realisators_id).subscribe((movies: any) => {
        for (let i = 0; i < movies.results.length; i++) {
          this.resultFilms.push([movies.results[i].title, movies.results[i].id])
        }
      });
    });
    console.log(this.resultFilms)
    return this.resultFilms;
  }

  // async getFilmsByRealisator(real: string, tab: any[]) {
  //   this.resultFilms = tab
  //   const unReal = await this.api.getPerson(real).toPromise();
  //   console.log(unReal)
  //   const movies = await this.api.getMoviesByRealisatorId(unReal.results[0].id).toPromise();
  //   // for (let i = 0; i < movies.results.length; i++) {
  //   //   this.resultFilms.push([movies.results[i].title, movies.results[i].id])
  //   // }
  //   console.log(this.resultFilms)
  //   return this.resultFilms;
  // }

  async getFilmsByActor(actors: string, tab: any[]) {
    this.resultFilms = tab;
    let tab_actors = actors.split(",");
    let promises: any[] = [];

    tab_actors.forEach(actor => {
      promises.push(this.api.getPerson(actor).toPromise());
    });

    await Promise.all(promises).then((acts: any[]) => {
      let actors_id = "";
      acts.forEach((act: any) => {
        actors_id += act.results[0].id + ",";
      });
      actors_id = actors_id.slice(0, -1);
      this.api.getMoviesByActorId(actors_id).subscribe((movies: any) => {
        for (let i = 0; i < movies.results.length; i++) {
          this.resultFilms.push([movies.results[i].title, movies.results[i].id])
        }
      });
    });
    return this.resultFilms;
  }

  async getMoviesByActorsAndRealisator(actors: string, realisator: string, tab: any[]) {
    this.resultFilms = tab;
    let actorsQuery = "";
    let realisatorId = "";
    let promises: any[] = [];

    promises.push(this.api.getPerson(realisator).toPromise());
  
    let actorsArray = actors.split(",");
    actorsArray.forEach(actor => {
      promises.push(this.api.getPerson(actor).toPromise());
    });
  
    await Promise.all(promises).then((actorsData: any[]) => {
      realisatorId = actorsData[0].results[0].id
      for(let i = 1; i < actorsData.length; i++){
        actorsQuery += actorsData[i].results[0].id + ",";
      }
      actorsQuery = actorsQuery.slice(0, -1);
    }).then(() => {
      return this.api.getMoviesByActorsAndRealisator(actorsQuery, realisatorId).toPromise();
    }).then((movies: any) => {
      this.resultFilms.push([movies.results[0].title, movies.results[0].id])
    });
    console.log(this.resultFilms)
    return this.resultFilms;

  } 

  async getMoviesByYearAndActors(year: string, actors: string, tab: any[]) {
    this.resultFilms = tab
    let tab_actors = actors.split(",");
    let promises: any[] = [];

    tab_actors.forEach(actor => {
      promises.push(this.api.getPerson(actor).toPromise());
    });

    await Promise.all(promises).then((acts: any[]) => {
      let actors_id = "";
      acts.forEach((act: any) => {
        actors_id += act.results[0].id + ",";
      });
      actors_id = actors_id.slice(0, -1);
      this.api.getMoviesByYearAndActors(year, actors_id).subscribe((movies: any) => {
        for (let i = 0; i < movies.results.length; i++) {
          this.resultFilms.push([movies.results[i].title, movies.results[i].id])
        }
      });
    });

    return this.resultFilms;
  }

  getMoviesByYearAndRealisator(year: string, real: string, tab: any[]){
    this.resultFilms = tab
    this.api.getPerson(real).subscribe((unReal: any) => {
      this.api.getMoviesByYearAndRealisator(year, unReal.results[0].id).subscribe((movies: any) => {
        for (let i = 0; i < movies.results.length; i++) {
          this.resultFilms.push([movies.results[i].title, movies.results[i].id])
        }
      })
    })
    return this.resultFilms;
  }

  

  async getMoviesByYearAndActorsAndRealisator(year: string, actors: string, real: string, tab: any[]){
    this.resultFilms = tab;
    let actorsQuery = "";
    let realisatorId = "";
    let promises: any[] = [];

    promises.push(this.api.getPerson(real).toPromise());
  
    let actorsArray = actors.split(",");
    actorsArray.forEach(actor => {
      promises.push(this.api.getPerson(actor).toPromise());
    });
  
    await Promise.all(promises).then((actorsData: any[]) => {
      realisatorId = actorsData[0].results[0].id
      for(let i = 1; i < actorsData.length; i++){
        actorsQuery += actorsData[i].results[0].id + ",";
      }
      actorsQuery = actorsQuery.slice(0, -1);
    }).then(() => {
      return this.api.getMoviesByYearAndActorsAndRealisator(year, actorsQuery, realisatorId).toPromise();
    }).then((movies: any) => {
      this.resultFilms.push([movies.results[0].title, movies.results[0].id])
    });

    return this.resultFilms;
  }

}
