import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Film } from 'app/models/film.model';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { RechercheService } from 'services/recherche.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-affichage-films',
  templateUrl: './affichage-films.component.html',
  styleUrls: ['./affichage-films.component.scss']
})
export class AffichageFilmsComponent implements OnInit {

  films: Film[] = [];

  filmsWithAPI: any[] = [];

  showFormRecherche: boolean = false;
  formRecherche!: FormGroup;
  titreControl = new FormControl();
  realisatorControl = new FormControl();
  yearControl = new FormControl();
  actorsControl = new FormControl();
  locationControl = new FormControl();
  accompagnateursControl = new FormControl();
  resList!: Map<string, number>;
  movieExist: any[] = [];
  movies: Map<any, string> = new Map();
  singleFilm: Map<any, string> = new Map();
  idActor: number = 0;
  moviesNumber: number = 0;
  switch_number = -1;
  error_message = ""

  constructor(private filmService: FilmsService, private api: ApiServiceService, private router: Router, private utilService: UtilsService, private rechercheService: RechercheService) { }

  ngOnInit(): void {
    this.filmService.getListsTitles();
    this.films = this.utilService.getListeRecherche();
    if(this.films) {
      this.moviesNumber = this.films.length
      for(let i = 0; i < this.moviesNumber; i++) {
        this.api.getMovieTMDBByIMDBID(this.films[i].omdbID).subscribe((filmAPI: any) => {
          var id = filmAPI['movie_results'][0].id;
          var poster = "https://image.tmdb.org/t/p/w185/" + filmAPI['movie_results'][0].poster_path;
          this.movies.set(filmAPI, poster);
        })
      }
    } else {
      this.filmService.getFilmsByUid(this.utilService.getUserId()).subscribe((allfilms) => {
        this.films = allfilms[0].movies;
        this.moviesNumber = this.films.length;
        this.utilService.setListOfFilms(this.films);
          for(let i = 0; i < this.moviesNumber; i++) {
            this.api.getMovieTMDBByIMDBID(this.films[i].omdbID).subscribe((filmAPI: any) => {
              var id = filmAPI['movie_results'][0].id;
              var poster = "https://image.tmdb.org/t/p/w185/" + filmAPI['movie_results'][0].poster_path;
              this.movies.set(filmAPI, poster);
            })
        }
      });
    }
  }

  reloadFilms() {
    this.filmService.getFilmsByUid(this.utilService.getUserId()).subscribe((allfilms) => {
      this.films = allfilms[0].movies;
      this.utilService.setListOfFilms(this.films);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl('/home');
      });
    })
  }

  clickFilm(infoFilm: any) {
    this.api.getMovieTMDbId(infoFilm.id).subscribe((film: any) => {
      var poster = "https://image.tmdb.org/t/p/w185/" + film.poster_path
      this.api.getMovieById(film.imdb_id).subscribe((filmAPI: any) => {
        this.singleFilm.set(filmAPI, poster);
        this.utilService.setMovie(this.singleFilm);
        this.router.navigateByUrl('/home/' + filmAPI.Title);
      })
    })
  }

  getActorsIdByActorsName(name: string){
    this.api.getActorsIdByActorsName(name).subscribe((actor: any) => {
      this.idActor = actor['results'][0].id;
    })
  }

  affichageForm() {
    this.showFormRecherche = !this.showFormRecherche;
  }

  rechercherFilm() {

    if (this.yearControl.value != undefined && this.yearControl.value != "" && this.realisatorControl.value != undefined && this.realisatorControl.value != "" && this.actorsControl.value != undefined && this.actorsControl.value != ""){
      this.switch_number = 1;
    } else {
      if (this.yearControl.value != undefined && this.yearControl.value != "" && this.actorsControl.value != "" && this.actorsControl.value != undefined){
        this.switch_number = 2
      } else {
        if (this.yearControl.value != undefined && this.yearControl.value != "" && this.realisatorControl.value != "" && this.realisatorControl.value != undefined){
          this.switch_number = 3
        } else {
          if(this.actorsControl.value != undefined && this.actorsControl.value != "" && this.realisatorControl.value != undefined && this.realisatorControl.value != ""){
            this.switch_number = 4
          }else {
            if (this.realisatorControl.value != undefined && this.realisatorControl.value != ""){
              this.switch_number = 5
            } else {
              if (this.yearControl.value != undefined && this.yearControl.value != ""){
                this.switch_number = 6
              } else {
                if (this.actorsControl.value != undefined && this.actorsControl.value != ""){
                  this.switch_number = 7
                }
              }
            }
          }
        }
      }
    }

    console.log(this.switch_number)

    switch (this.switch_number) {
      // case (1):
      //   this.getMoviesByYearAndActorsAndRealisator(this.yearControl.value, this.actorsControl.value, this.realisatorControl.value, this.resList);
      //   break;
      // case (2):
      //   this.getMoviesByYearAndActors(this.yearControl.value, this.actorsControl.value, this.resList);
      //   break;
      // case (3):
      //   this.getMoviesByYearAndRealisator(this.yearControl.value, this.realisatorControl.value, this.resList);
      //   break;
      // case (4):
      //   this.getMoviesByActorsAndRealisator(this.actorsControl.value, this.realisatorControl.value, this.resList);
      //   break;
      case (5):
        this.getFilmsByRealisator(this.realisatorControl.value);
        break;
      case (6):
      //   this.getFilmsByYear(this.yearControl.value, this.resList);
      //   break;
      // case (7):
      //   this.getFilmsByActors(this.actorsControl.value, this.resList);
      //   break;
      default:
        this.error_message = "Vous devez remplir au moins un champ";
        break;
    }

    //   [];
    // if(this.titreControl.value != undefined && this.titreControl.value != ""){
    //   this.getFilmsByTitre(this.titreControl.value, this.resList);
    // }
    // if(this.locationControl.value != undefined && this.locationControl.value != ""){
    //   this.getFilmsByLocation(this.locationControl.value, this.resList);
    // }
    // if(this.accompagnateursControl.value != undefined && this.accompagnateursControl.value != ""){
    //   this.getFilmsByAccompagnateurs(this.accompagnateursControl.value, this.resList);
    // }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/home');
    });
  }

  // parti du formulaire de recherche

  // REQUETE VERS NOTRE BASE DE DONNEES

  getFilmsByTitre(titre: string, tab: any[]){
      this.rechercheService.getFilmsByTitre(titre, tab);
    console.log(this.resList)
  }

  getFilmsByDateVision(year: string, tab: any[]) {
      this.rechercheService.getFilmsByDateVision(year, tab);
    console.log(this.resList)
  }

  getFilmsByLocation(loc: string, tab: any[]) {
      this.rechercheService.getFilmsByLocation(loc, tab);
    console.log(this.resList)
  }

  getFilmsByAccompagnateurs(acc: string, tab: any[]) {
      this.rechercheService.getFilmsByAccompagnateurs(acc, tab);
    console.log(this.resList)
  }

  // REQUETE VERS L'API

  async getFilmsByRealisator(real: string){
    this.resList = await this.rechercheService.getFilmsByRealisator(real)
    console.log(this.resList)
    console.log(this.resList.size);

    for (const [key, value] of this.resList) {
      console.log("kakak")
      this.api.getMovieTMDbId(value).subscribe((movie: any) => {
        console.log(movie)
        this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
          this.movieExist.push(film)
          console.log(this.movieExist)
        })
      })
    }
    console.log(this.resList);
  }

  // async getFilmsByYear(year: string, tab: any[]) {
  //   this.resList = await this.rechercheService.getFilmsByYear(year, tab);

  //   for (let i = 0; i < this.resList.length; i++) {
  //     this.api.getMovieTMDbId(this.resList[i][1]).subscribe((movie: any) => {
  //       console.log(movie)
  //       this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
  //         this.movieExist.push(film)
  //       })
  //     })
  //   }
  //   console.log(this.movieExist)
  // }

  // async getFilmsByActors(actors: string, tab: any[]) {
  //   this.resList = await this.rechercheService.getFilmsByActor(actors, tab);

  //   for (let i = 0; i < this.resList.length; i++) {
  //     this.api.getMovieTMDbId(this.resList[i][1]).subscribe((movie: any) => {
  //       console.log(movie)
  //       this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
  //         this.movieExist.push(film)
  //       })
  //     })
  //   }
  //   console.log(this.movieExist)
  // }

  // async getMoviesByYearAndActors(year: string, actors: string, tab: any[]) {
  //   this.resList = await this.rechercheService.getMoviesByYearAndActors(year, actors, tab);

  //   for (let i = 0; i < this.resList.length; i++) {
  //     this.api.getMovieTMDbId(this.resList[i][1]).subscribe((movie: any) => {
  //       console.log(movie)
  //       this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
  //         this.movieExist.push(film)
  //       })
  //     })
  //   }
  //   console.log(this.movieExist)
  // }

  // async getMoviesByYearAndRealisator(year: string, real: string, tab: any[]){
  //   this.resList = await this.rechercheService.getMoviesByYearAndRealisator(year, real, tab);

  //   for (let i = 0; i < this.resList.length; i++) {
  //     this.api.getMovieTMDbId(this.resList[i][1]).subscribe((movie: any) => {
  //       console.log(movie)
  //       this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
  //         this.movieExist.push(film)
  //       })
  //     })
  //   }
  //   console.log(this.movieExist)
  // }

  // async getMoviesByActorsAndRealisator(actors: string, real: string, tab: any[]) {
  //   this.resList = await this.rechercheService.getMoviesByActorsAndRealisator(actors,real, tab)

  //   for (let i = 0; i < this.resList.length; i++) {
  //     this.api.getMovieTMDbId(this.resList[i][1]).subscribe((movie: any) => {
  //       console.log(movie)
  //       this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
  //         this.movieExist.push(film)
  //       })
  //     })
  //   }
  //   console.log(this.movieExist)
  // }

  // async getMoviesByYearAndActorsAndRealisator(year: string, actors: string, real: string, tab: any[]){
  //   this.resList = await this.rechercheService.getMoviesByYearAndActorsAndRealisator(year, actors, real, tab);

  //   for (let i = 0; i < this.resList.length; i++) {
  //     this.api.getMovieTMDbId(this.resList[i][1]).subscribe((movie: any) => {
  //       console.log(movie)
  //       this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
  //         this.movieExist.push(film)
  //       })
  //     })
  //   }

  //   console.log(this.movieExist)
  // }
}
