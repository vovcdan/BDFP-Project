import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
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
  searchControlCarac = new FormControl('', Validators.pattern('^[A-Za-z]* [A-Za-z]*(, [A-Za-z]* [A-Za-z]*)?'));
  searchControlAnnee = new FormControl('', Validators.pattern('^[0-9]{4}$'));
  searchControlDate = new FormControl('', Validators.pattern('^(0[1-9]|1[0-9]|2[0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$'));
  searchControlNote = new FormControl('', Validators.pattern('^[0-5]'));
  searchedMovies: any[] = [];
  formRecherche!: FormGroup;
  resList = new Map<string, number>();
  moviesInDB = new Map<number, string>();
  movieExist: any[] = [];
  switch_number = -1;
  error_message = '';
  finished = false;
  singleFilm: Map<any, string> = new Map();

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
    this.formRecherche = new FormGroup({
      titreControl: new FormControl(),
      realisatorControl: new FormControl(),
      yearControl: new FormControl(),
      actorsControl: new FormControl(),
      locationControl: new FormControl(),
      accompagnateursControl: new FormControl(),
      noteControl: new FormControl(),
      avisControl: new FormControl(),
    });
  }

  async getSearchedMovies() {
    this.searchedMovies = await this.utilService.getSearchedMovies();
    console.log(this.searchedMovies);
  }

  searchedMoviesNotEmpty() {
    if (this.moviesInDB) {
      return true;
    } else {
      return false;
    }
  }

  async rechercherFilm() {
    this.moviesInDB.clear();
    this.finished = false;

    if (
      this.formRecherche.value.yearControl != undefined &&
      this.formRecherche.value.yearControl != '' &&
      this.formRecherche.value.realisatorControl != undefined &&
      this.formRecherche.value.realisatorControl != '' &&
      this.formRecherche.value.actorsControl != undefined &&
      this.formRecherche.value.actorsControl != ''
    ) {
      this.switch_number = 1;
    } else {
      if (
        this.formRecherche.value.yearControl != undefined &&
        this.formRecherche.value.yearControl != '' &&
        this.formRecherche.value.actorsControl != '' &&
        this.formRecherche.value.actorsControl != undefined
      ) {
        this.switch_number = 2;
      } else {
        if (
          this.formRecherche.value.yearControl != undefined &&
          this.formRecherche.value.yearControl != '' &&
          this.formRecherche.value.realisatorControl != '' &&
          this.formRecherche.value.realisatorControl != undefined
        ) {
          this.switch_number = 3;
        } else {
          if (
            this.formRecherche.value.actorsControl != undefined &&
            this.formRecherche.value.actorsControl != '' &&
            this.formRecherche.value.realisatorControl != undefined &&
            this.formRecherche.value.realisatorControl != ''
          ) {
            this.switch_number = 4;
          } else {
            if (
              this.formRecherche.value.realisatorControl != undefined &&
              this.formRecherche.value.realisatorControl != ''
            ) {
              this.switch_number = 5;
            } else {
              if (
                this.formRecherche.value.actorsControl != undefined &&
                this.formRecherche.value.actorsControl != ''
              ) {
                this.switch_number = 6;
              }
            }
          }
        }
      }
    }

    console.log(this.switch_number);

    switch (this.switch_number) {
      case 1:
        await this.getFilmsByYearAndActorsAndRealisator(
          this.formRecherche.value.yearControl,
          this.formRecherche.value.actorsControl,
          this.formRecherche.value.realisatorControl
        );
        break;
      case 2:
        await this.getFilmsByYearAndActors(
          this.formRecherche.value.yearControl,
          this.formRecherche.value.actorsControl
        );
        break;
      case 3:
        await this.getFilmsByYearAndRealisator(
          this.formRecherche.value.yearControl,
          this.formRecherche.value.realisatorControl
        );
        break;
      case 4:
        await this.getFilmsByActorsAndRealisator(
          this.formRecherche.value.actorsControl,
          this.formRecherche.value.realisatorControl
        );
        break;
      case 5:
        await this.getFilmsByRealisator(this.formRecherche.value.realisatorControl);
        break;
      case 6:
        await this.getFilmsByActors(this.formRecherche.value.actorsControl);
        break;
      default:
        this.error_message = 'Vous devez remplir au moins un champ';
        break;
    }

    if (
      this.formRecherche.value.yearControl != undefined &&
      this.formRecherche.value.yearControl != ''
    ) {
      await this.getFilmsByDateVision(this.formRecherche.value.yearControl);
    }
    if (
      this.formRecherche.value.accompagnateursControl != undefined &&
      this.formRecherche.value.accompagnateursControl != ''
    ) {
      await this.getFilmsByAccompagnateurs(
        this.formRecherche.value.accompagnateursControl
      );
    }
    if (
      this.formRecherche.value.locationControl != undefined &&
      this.formRecherche.value.locationControl != ''
    ) {
      await this.getFilmsByLocation(this.formRecherche.value.locationControl);
    }
    if (
      this.formRecherche.value.avisControl != undefined &&
      this.formRecherche.value.avisControl != ''
    ) {
      await this.getFilmsByAvis(this.formRecherche.value.avisControl);
    }
    if (
      this.formRecherche.value.noteControl != undefined &&
      this.formRecherche.value.noteControl != ''
    ) {
      await this.getFilmsByNote(this.formRecherche.value.noteControl);
    }

    console.log(this.moviesInDB)

    //TODO recuperer les films depuis l'API l'omdbID contenu dans la map moviesInDB

    this.finished = true;
  }

  // parti du formulaire de recherche

  // REQUETE VERS NOTRE BASE DE DONNEES

  async getFilmsByDateVision(year: string) {
    try {
      const res = await this.filmService.getFilmsOfUserByDateVision(year);
      if (res !== null) {
        if (this.moviesInDB.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res)
        }
      } 
    } catch (err) {
      console.error(err);
    }
  }

  async getFilmsByLocation(loc: string) {
    try {
      const res = await this.filmService.getFilmsOfUserByLocation(loc);
      if (res !== null) {
        if (this.moviesInDB.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res)
        }
      } 
    } catch (err) {
      console.error(err);
    }
  }

  async getFilmsByAccompagnateurs(acc: string) {
    try {
      const res = await this.filmService.getFilmsOfUserByAccompagnateurs(acc);
      if (res !== null) {
        if (this.moviesInDB.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res)
        }
      } 
    } catch (err) {
      console.error(err);
    }
  }

  async getFilmsByAvis(avis: string) {
    try {
      const res = await this.filmService.getFilmsOfUserByAvis(avis);
      if (res !== null) {
        if (this.moviesInDB.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res)
        }
      } 
    } catch (err) {
      console.error(err);
    }
  }

  async getFilmsByNote(note: string) {
    try {
      const res = await this.filmService.getFilmsOfUserByNote(note);
      if (res !== null) {
        if (this.moviesInDB.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res)
        }
      } 
    } catch (err) {
      console.error(err);
    }
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
          this.moviesInDB.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDB);
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
          let movie_jsoned = await movieDB!.json();
          this.moviesInDB.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }

      this.utilService.setSearchedMovies(this.moviesInDB);
      console.log(this.moviesInDB);
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
          this.moviesInDB.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDB);
      console.log(this.moviesInDB);
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
          this.moviesInDB.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDB);
      console.log(this.moviesInDB);
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
          this.moviesInDB.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDB);
      console.log(this.moviesInDB);
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
          this.moviesInDB.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDB);
      console.log(this.moviesInDB);
    } catch (error) {
      console.error(error);
    }
  }


  clickFilm(infoFilm: any) {
    this.router.navigateByUrl('/home/' + infoFilm.titre);
  } 

  intersectMaps(map1: Map<number, string>, map2: Map<number, string>) {
    const result = new Map<any, any>();
    if(map1.size === 0 || map2.size === 0){
      return result;
    }
    for (const [key, value] of map1.entries()) {
      if (map2.has(key)) {
        result.set(key, map2.get(key));
      }
    }
    return result;
  }
}
