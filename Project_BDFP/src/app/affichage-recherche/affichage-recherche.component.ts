import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  searchControlCaracReal = new FormControl('', Validators.pattern('^[A-Za-z]* [A-Za-z]*(, [A-Za-z]* [A-Za-z]*)?'));
  searchControlCaracActors = new FormControl('', Validators.pattern('^[A-Za-z]* [A-Za-z]*(, [A-Za-z]* [A-Za-z]*){0,}'));
  searchControlAnnee = new FormControl('', Validators.pattern('^[0-9]{4}$'));
  searchControlDate = new FormControl(
    '',
    Validators.pattern('^(0[1-9]|1[0-9]|2[0-9]|3[01])(0[1-9]|1[0-2])[0-9]{4}$')
  );
  searchControlNote = new FormControl('', Validators.pattern('^[0-5]$'));
  searchedMovies: any[] = [];
  formRecherche!: FormGroup;
  showFormRecherche = true;
  resList = new Map<string, number>();
  moviesInDB = new Map<number, string>();
  moviesInDBByAPI = new Map<number, string>();
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
      locationControl: new FormControl(),
      accompagnateursControl: new FormControl(),
      avisControl: new FormControl(),
    });
  }

  async getSearchedMovies() {
    this.searchedMovies = await this.utilService.getSearchedMovies();
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
    this.moviesInDBByAPI.clear();
    this.finished = false;

    if (
      this.searchControlDate.value != undefined &&
      this.searchControlDate.value != ''
    ) {
      await this.getFilmsByDateVision(this.searchControlDate.value);
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
      this.searchControlNote.value != undefined &&
      this.searchControlNote.value != ''
    ) {
      await this.getFilmsByNote(this.searchControlNote.value);
    }

    if (
      this.searchControlAnnee.value != undefined &&
      this.searchControlAnnee.value != '' &&
      this.searchControlCaracReal.value != undefined &&
      this.searchControlCaracReal.value != '' &&
      this.searchControlCaracActors.value != undefined &&
      this.searchControlCaracActors.value != ''
    ) {
      this.switch_number = 1;
    } else {
      if (
        this.searchControlAnnee.value != undefined &&
        this.searchControlAnnee.value != '' &&
        this.searchControlCaracActors.value != '' &&
        this.searchControlCaracActors.value != undefined
      ) {
        this.switch_number = 2;
      } else {
        if (
          this.searchControlAnnee.value != undefined &&
          this.searchControlAnnee.value != '' &&
          this.searchControlCaracReal.value != '' &&
          this.searchControlCaracReal.value != undefined
        ) {
          this.switch_number = 3;
        } else {
          if (
            this.searchControlCaracActors.value != undefined &&
            this.searchControlCaracActors.value != '' &&
            this.searchControlCaracReal.value != undefined &&
            this.searchControlCaracReal.value != ''
          ) {
            this.switch_number = 4;
          } else {
            if (
              this.searchControlCaracReal.value != undefined &&
              this.searchControlCaracReal.value != ''
            ) {
              this.switch_number = 5;
            } else {
              if (
                this.searchControlCaracActors.value != undefined &&
                this.searchControlCaracActors.value != ''
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
          this.searchControlAnnee.value!,
          this.searchControlCaracActors.value!,
          this.searchControlCaracReal.value!
        );
        break;
      case 2:
        await this.getFilmsByYearAndActors(
          this.searchControlAnnee.value!,
          this.searchControlCaracActors.value!
        );
        break;
      case 3:
        await this.getFilmsByYearAndRealisator(
          this.searchControlAnnee.value!,
          this.searchControlCaracReal.value!
        );
        break;
      case 4:
        await this.getFilmsByActorsAndRealisator(
          this.searchControlCaracActors.value!,
          this.searchControlCaracReal.value!
        );
        break;
      case 5:
        await this.getFilmsByRealisator(this.searchControlCaracReal.value!);
        break;
      case 6:
        await this.getFilmsByActors(this.searchControlCaracActors.value!);
        break;
      default:
        this.error_message = 'Vous devez remplir au moins un champ';
        break;
    }

    // console.log(this.moviesInDBByAPI)
    // console.log(this.moviesInDB)

    if (
      this.searchControlAnnee.value != undefined &&
      this.searchControlAnnee.value != '' ||
      this.searchControlCaracReal.value != undefined &&
      this.searchControlCaracReal.value != '' ||
      this.searchControlCaracActors.value != undefined &&
      this.searchControlCaracActors.value != ''
    ) {
      this.moviesInDB = this.intersectMaps(
        this.moviesInDB,
        this.moviesInDBByAPI
      );
    }

    console.log(this.moviesInDB);

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
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res);
        }
      } else {
        this.moviesInDB = new Map<number, string>();
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
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res);
        }
      } else {
        this.moviesInDB = new Map<number, string>();
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
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res);
        }
      } else {
        this.moviesInDB = new Map<number, string>();
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
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res);
        }
      } else {
        this.moviesInDB = new Map<number, string>();
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
          this.moviesInDB = this.intersectMaps(this.moviesInDB, res);
        }
      } else {
        this.moviesInDB = new Map<number, string>();
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
          this.moviesInDBByAPI.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDBByAPI);
    } catch (error) {
      console.error(error);
    }
  }

  async getFilmsByActors(actors: string) {
    try {
      this.resList = await this.rechercheService.getFilmsByActor(actors);

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
          this.moviesInDBByAPI.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }

      this.utilService.setSearchedMovies(this.moviesInDBByAPI);
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
          this.moviesInDBByAPI.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDBByAPI);
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
          this.moviesInDBByAPI.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDBByAPI);
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
          this.moviesInDBByAPI.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDBByAPI);
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
          this.moviesInDBByAPI.set(movie_jsoned.omdbID, movie_jsoned.titre);
        } catch (error) {
          console.error(error);
        }
      }
      this.utilService.setSearchedMovies(this.moviesInDBByAPI);
    } catch (error) {
      console.error(error);
    }
  }

  clickFilm(titre: any) {
    this.router.navigateByUrl('/home/' + titre);
  }

  intersectMaps(map1: Map<number, string>, map2: Map<number, string>) {
    const result = new Map<any, any>();
    if (map1.size === 0 || map2.size === 0) {
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
