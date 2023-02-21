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
        for (let i = 0; i < movies.results.length; i++) {
          this.resultFilms.push(movies.results[i].title)
        }
      })
    })
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
      this.api.getMoviesByActorId(actors_id).subscribe((movies: any) => {
        for (let i = 0; i < movies.results.length; i++) {
          this.resultFilms.push(movies.results[i].title)
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
      this.resultFilms.push(movies.results[0].title)
    });
  
    return this.resultFilms;

  }
  
  // getMoviesByActorsAndRealisator(actors: string, realisator: string, tab: any[]) {
  //   this.resultFilms = tab;

  //   this.api.getMoviesByActorsAndRealisator(actors, realisator).subscribe((movies: any) => {
  //     for (let i = 0; i < movies.results.length; i++) {
  //       this.resultFilms.push(movies.results[i].title);
  //     }
  //   });


  //   // let tab_actors = actors.split(",");
  //   // let promises: any[] = [];
  //   // let real_id = "";

  //   // this.api.getPerson(realisator).subscribe((unReal: any) => {
  //   //   real_id = unReal.results[0].id;
  //   // })

  //   // tab_actors.forEach(actor => {
  //   //   promises.push(this.api.getPerson(actor).toPromise());
  //   // });

  //   // promises.push(this.api.getPerson(realisator).toPromise());
    

  //   // Promise.all(promises).then((acts: any[]) => {
  //   //   let actors_id = "";      

  //   //   acts.forEach((act: any) => {
  //   //     actors_id += act.results[0].id + ",";
  //   //   });
  //   //   actors_id = actors_id.slice(0, -1);

  //   //   this.api.getMoviesByActorsAndRealisator(actors_id, real_id).subscribe((movies: any) => {
  //   //     for (let i = 0; i < movies.results.length; i++) {
  //   //       this.resultFilms.push(movies.results[i].title)
  //   //     }
  //   //   });
  //   // });

  //   return this.resultFilms;
  // }
  

}
