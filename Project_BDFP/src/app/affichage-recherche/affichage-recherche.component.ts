import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { RechercheService } from 'services/recherche.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-affichage-recherche',
  templateUrl: './affichage-recherche.component.html',
  styleUrls: ['./affichage-recherche.component.scss'],
})
export class AffichageRechercheComponent implements OnInit {
  searchedMovies: any[] = [];
  formRecherche!: FormGroup;
  titreControl = new FormControl();
  realisatorControl = new FormControl();
  yearControl = new FormControl();
  actorsControl = new FormControl();
  locationControl = new FormControl();
  accompagnateursControl = new FormControl();
  resList!: Map<string, number>;
  movieExist: any[] = [];
  switch_number = -1;
  error_message = '';
  finished = false;

  constructor(
    private filmService: FilmsService,
    public diag: MatDialog,
    private api: ApiServiceService,
    private utilService: UtilsService,
    private router: Router,
    private rechercheService: RechercheService
  ) {}

  ngOnInit() {
    this.getSearchedMovies();
  }

  async getSearchedMovies() {
    this.searchedMovies = await this.utilService.getSearchedMovies();
    console.log(this.searchedMovies);
  }

  searchedMoviesNotEmpty() {
    if (this.movieExist) {
      return true;
    } else {
      return false;
    }
  }

  async rechercherFilm() {
    this.movieExist = [];
    this.finished = false;

    if (
      this.yearControl.value != undefined &&
      this.yearControl.value != '' &&
      this.realisatorControl.value != undefined &&
      this.realisatorControl.value != '' &&
      this.actorsControl.value != undefined &&
      this.actorsControl.value != ''
    ) {
      this.switch_number = 1;
    } else {
      if (
        this.yearControl.value != undefined &&
        this.yearControl.value != '' &&
        this.actorsControl.value != '' &&
        this.actorsControl.value != undefined
      ) {
        this.switch_number = 2;
      } else {
        if (
          this.yearControl.value != undefined &&
          this.yearControl.value != '' &&
          this.realisatorControl.value != '' &&
          this.realisatorControl.value != undefined
        ) {
          this.switch_number = 3;
        } else {
          if (
            this.actorsControl.value != undefined &&
            this.actorsControl.value != '' &&
            this.realisatorControl.value != undefined &&
            this.realisatorControl.value != ''
          ) {
            this.switch_number = 4;
          } else {
            if (
              this.realisatorControl.value != undefined &&
              this.realisatorControl.value != ''
            ) {
              this.switch_number = 5;
            } else {
              if (
                this.yearControl.value != undefined &&
                this.yearControl.value != ''
              ) {
                this.switch_number = 6;
              } else {
                if (
                  this.actorsControl.value != undefined &&
                  this.actorsControl.value != ''
                ) {
                  this.switch_number = 7;
                }
              }
            }
          }
        }
      }
    }

    console.log(this.switch_number);

    switch (this.switch_number) {
      case 1:
        this.getFilmsByYearAndActorsAndRealisator(
          this.yearControl.value,
          this.actorsControl.value,
          this.realisatorControl.value
        );
        break;
      case 2:
        this.getFilmsByYearAndActors(
          this.yearControl.value,
          this.actorsControl.value
        );
        break;
      case 3:
        this.getFilmsByYearAndRealisator(
          this.yearControl.value,
          this.realisatorControl.value
        );
        break;
      case 4:
        this.getFilmsByActorsAndRealisator(
          this.actorsControl.value,
          this.realisatorControl.value
        );
        break;
      case 5:
        this.getFilmsByRealisator(this.realisatorControl.value);
        break;
      case 6:
        this.getFilmsByYear(this.yearControl.value);
        break;
      case 7:
        await this.getFilmsByActors(this.actorsControl.value);
        break;
      default:
        this.error_message = 'Vous devez remplir au moins un champ';
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

    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this.router.navigateByUrl('/home');
    // });

    this.finished = true;
  }

  getMoviesByYearAndRealisator(
    value: any,
    value1: any,
    resList: Map<string, number>
  ) {
    throw new Error('Method not implemented.');
  }

  // parti du formulaire de recherche

  // REQUETE VERS NOTRE BASE DE DONNEES

  getFilmsByTitre(titre: string, tab: any[]) {
    this.rechercheService.getFilmsByTitre(titre, tab);
    console.log(this.resList);
  }

  getFilmsByDateVision(year: string, tab: any[]) {
    this.rechercheService.getFilmsByDateVision(year, tab);
    console.log(this.resList);
  }

  getFilmsByLocation(loc: string, tab: any[]) {
    this.rechercheService.getFilmsByLocation(loc, tab);
    console.log(this.resList);
  }

  getFilmsByAccompagnateurs(acc: string, tab: any[]) {
    this.rechercheService.getFilmsByAccompagnateurs(acc, tab);
    console.log(this.resList);
  }

  // REQUETE VERS L'API

  async getFilmsByRealisator(real: string) {
    try {
      this.resList = await this.rechercheService.getFilmsByRealisator(real);

      for (const [key, value] of this.resList) {
        try {
          let data = await this.api.getMovieTMDbIdAsync(value);
          let movie = await data.json();
          let imdb_id = await movie.imdb_id;
          let movie_db = await this.filmService.getFilmByOmdbIDAsync(
            this.utilService.getUserId(),
            imdb_id
          );
          let movie_jsoned = await movie_db!.json();
          this.movieExist.push(movie_jsoned);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.movieExist);
    } catch (error) {
      console.error(error);
    }
  }

  async getFilmsByYear(year: string) {
    try {
      this.resList = await this.rechercheService.getFilmsByYear(year);

      for (const [key, value] of this.resList) {
        try {
          let movie = await this.api.getMovieTMDbIdAsync(value);
          let data = await movie.json();
          let imdb_id = data.imdb_id;
          let movieDB = await this.filmService.getFilmByOmdbIDAsync(
            this.utilService.getUserId(),
            imdb_id
          );
          let movie_jsoned = await movieDB!.json();
          this.movieExist.push(movie_jsoned);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.movieExist);
      console.log(this.movieExist);
    } catch (error) {
      console.error(error);
    }
  }

  async getFilmsByActors(actors: string) {
    try {
      this.resList = await this.rechercheService.getFilmsByActor(actors);
      console.log(this.resList);

      for (const [key, value] of this.resList) {
        try {
          let movie = await this.api.getMovieTMDbIdAsync(value);
          let data = await movie.json();
          let imdb_id = await data.imdb_id;
          let movieDB = await this.filmService.getFilmByOmdbIDAsync(
            this.utilService.getUserId(),
            imdb_id
          );
          console.log('after getFilmByOmdbIDAsync');
          console.log(movieDB);
          let data2 = await movieDB!.json();
          console.log('after movieDB!.json()');
          console.log(data2);
          this.movieExist.push(data2);
        } catch (error) {
          console.error(error);
        }
      }

      this.utilService.setSearchedMovies(this.movieExist);
      console.log(this.movieExist);
    } catch (error) {
      console.error(error);
    }
  }

  async getFilmsByYearAndRealisator(year: string, real: string) {
    try {
      this.resList = await this.rechercheService.getMoviesByYearAndRealisator(
        year,
        real
      );

      for (const [key, value] of this.resList) {
        try {
          let movie = await this.api.getMovieTMDbIdAsync(value);
          let data = await movie.json();
          let imdb_id = await data.imdb_id;
          let movieDB = await this.filmService.getFilmByOmdbIDAsync(
            this.utilService.getUserId(),
            imdb_id
          );
          let movie_jsoned = await movieDB!.json();
          this.movieExist.push(movie_jsoned);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.movieExist);
      console.log(this.movieExist);
    } catch (error) {
      console.error(error);
    }
  }

  async getFilmsByYearAndActors(year: string, actors: string) {
    try {
      this.resList = await this.rechercheService.getMoviesByYearAndActors(
        year,
        actors
      );

      for (const [key, value] of this.resList) {
        try {
          let movie = await this.api.getMovieTMDbIdAsync(value);
          let data = await movie.json();
          let imdb_id = await data.imdb_id;
          let movieDB = await this.filmService.getFilmByOmdbIDAsync(
            this.utilService.getUserId(),
            imdb_id
          );
          let movie_jsoned = await movieDB!.json();
          this.movieExist.push(movie_jsoned);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.movieExist);
      console.log(this.movieExist);
    } catch (error) {
      console.error(error);
    }
  }

  async getFilmsByActorsAndRealisator(actors: string, real: string) {
    try {
      this.resList = await this.rechercheService.getMoviesByActorsAndRealisator(
        actors,
        real
      );

      for (const [key, value] of this.resList) {
        try {
          let movie = await this.api.getMovieTMDbIdAsync(value);
          let data = await movie.json();
          let imdb_id = await data.imdb_id;
          let movieDB = await this.filmService.getFilmByOmdbIDAsync(
            this.utilService.getUserId(),
            imdb_id
          );
          let movie_jsoned = await movieDB!.json();
          this.movieExist.push(movie_jsoned);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.movieExist);
      console.log(this.movieExist);
    } catch (error) {
      console.error(error);
    }
  }

  async getFilmsByYearAndActorsAndRealisator(
    year: string,
    actors: string,
    real: string
  ) {
    try {
      this.resList =
        await this.rechercheService.getMoviesByYearAndActorsAndRealisator(
          year,
          actors,
          real
        );

      for (const [key, value] of this.resList) {
        try {
          let movie = await this.api.getMovieTMDbIdAsync(value);
          let data = await movie.json();
          let imdb_id = await data.imdb_id;
          let movieDB = await this.filmService.getFilmByOmdbIDAsync(
            this.utilService.getUserId(),
            imdb_id
          );
          let movie_jsoned = await movieDB!.json();
          this.movieExist.push(movie_jsoned);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.movieExist);
      console.log(this.movieExist);
    } catch (error) {
      console.error(error);
    }
  }
}
