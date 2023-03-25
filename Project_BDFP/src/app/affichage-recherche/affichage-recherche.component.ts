import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { InitService } from 'services/init.service';
import { RechercheService } from 'services/recherche.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-affichage-recherche',
  templateUrl: './affichage-recherche.component.html',
  styleUrls: ['./affichage-recherche.component.scss'],
})
export class AffichageRechercheComponent implements OnInit {
  @ViewChild('myDiv') myDiv!: ElementRef;
  searchedMovies: any[] = [];
  formRecherche!: FormGroup;
  showFormRecherche = true;
  resList = new Map<string, number>();
  moviesInDB?: Map<number, any>;
  moviesInDBByAPI?: Map<number, any>;
  movieExist: any[] = [];
  switch_number = -1;
  error_message = '';
  finished = false;
  singleFilm: Map<any, string> = new Map();
  finalMovieResults: any;
  spinner: boolean = false;
  noResult = false;

  cinemaFieldHistory!: [string];
  accompagnateursFieldHistory!: [string];

  constructor(
    private filmService: FilmsService,
    public diag: MatDialog,
    private api: ApiServiceService,
    private utilService: UtilsService,
    private router: Router,
    private rechercheService: RechercheService,
    private init: InitService
  ) {}

  async ngOnInit() {
    this.getSearchedMovies();


    this.formRecherche = new FormGroup({
      realisateurControl: new FormControl('', Validators.pattern('^[A-Za-z]* [A-Za-z]*(, [A-Za-z]* [A-Za-z]*)?')),
      acteurControl: new FormControl('', Validators.pattern('^[A-Za-z]* [A-Za-z]*(, [A-Za-z]* [A-Za-z]*){0,}')),
      anneeSortieControl: new FormControl('', Validators.pattern('^[0-9]{4}$')),
      dateVisionControl: new FormControl('', Validators.pattern('^19[0-9]{2}|2[0-9]{3}$')),
      noteControl: new FormControl('', Validators.pattern('^[0-5]$')),
      locationControl: new FormControl(),
      accompagnateursControl: new FormControl(),
      avisControl: new FormControl(),
    });

    this.cinemaFieldHistory = await this.getCinemaHistory();
    this.accompagnateursFieldHistory = await this.getAccompagnateursHistory();
  }

  async getSearchedMovies() {
    this.searchedMovies = await this.utilService.getSearchedMovies();
  }

  async getCinemaHistory() {
    let cinemaHistory = await this.filmService.getCinemaHistory();
    return cinemaHistory;
  }

  async getAccompagnateursHistory() {
    let accompagnateursHistory = await this.filmService.getAccompagnateursHistory();
    return accompagnateursHistory;
  }

  async deleteCinemaHistory(event: MouseEvent, cinema: string) {
    event.stopPropagation();
    let cinemaField = await this.filmService.deleteCinemaHistory(cinema);
    this.cinemaFieldHistory = cinemaField;
  }

  async deleteAccompagnateurHistory(event: MouseEvent, accompagnateur: string) {
    event.stopPropagation();
    let accompagnateursHistory = await this.filmService.deleteAccompagnateursHistory(accompagnateur);
    this.accompagnateursFieldHistory = accompagnateursHistory;
  }

  searchedMoviesNotEmpty() {
    this.spinner = true;
    if (this.moviesInDB) {
      return true;
    } else {
      return false;
    }
  }

  async rechercherFilm() {
    const startTime = new Date().getTime();
    this.finished = false;
    this.spinner = true;

    if (this.moviesInDB != undefined) {
      this.moviesInDB = undefined;
    }
    if (this.moviesInDBByAPI != undefined) {
      this.moviesInDBByAPI = undefined;
    }

    if (
      this.formRecherche.value.dateVisionControl != undefined &&
      this.formRecherche.value.dateVisionControl != ''
    ) {
      if (this.moviesInDB == undefined) {
        this.moviesInDB = new Map();
      }
      await this.getFilmsByDateVision(this.formRecherche.value.dateVisionControl);
    }
    if (
      this.formRecherche.value.accompagnateursControl != undefined &&
      this.formRecherche.value.accompagnateursControl != ''
    ) {
      if (this.moviesInDB == undefined) {
        this.moviesInDB = new Map();
      }
      await this.getFilmsByAccompagnateurs(
        this.formRecherche.value.accompagnateursControl
      );
    }
    if (
      this.formRecherche.value.locationControl != undefined &&
      this.formRecherche.value.locationControl != ''
    ) {
      if (this.moviesInDB == undefined) {
        this.moviesInDB = new Map();
      }
      await this.getFilmsByLocation(this.formRecherche.value.locationControl);
    }
    if (
      this.formRecherche.value.avisControl != undefined &&
      this.formRecherche.value.avisControl != ''
    ) {
      if (this.moviesInDB == undefined) {
        this.moviesInDB = new Map();
      }
      await this.getFilmsByAvis(this.formRecherche.value.avisControl);
    }
    if (
      this.formRecherche.value.noteControl != undefined &&
      this.formRecherche.value.noteControl != ''
    ) {
      if (this.moviesInDB == undefined) {
        this.moviesInDB = new Map();
      }
      await this.getFilmsByNote(this.formRecherche.value.noteControl);
    }

    if (
      this.formRecherche.value.anneeSortieControl != undefined &&
      this.formRecherche.value.anneeSortieControl != '' &&
      this.formRecherche.value.realisateurControl != undefined &&
      this.formRecherche.value.realisateurControl != '' &&
      this.formRecherche.value.acteurControl != undefined &&
      this.formRecherche.value.acteurControl != ''
    ) {
      if (this.moviesInDBByAPI == undefined) {
        this.moviesInDBByAPI = new Map();
      }
      this.switch_number = 1;
    } else {
      if (
        this.formRecherche.value.anneeSortieControl != undefined &&
        this.formRecherche.value.anneeSortieControl != '' &&
        this.formRecherche.value.acteurControl != '' &&
        this.formRecherche.value.acteurControl != undefined
      ) {
        if (this.moviesInDBByAPI == undefined) {
          this.moviesInDBByAPI = new Map();
        }
        this.switch_number = 2;
      } else {
        if (
          this.formRecherche.value.anneeSortieControl != undefined &&
          this.formRecherche.value.anneeSortieControl != '' &&
          this.formRecherche.value.realisateurControl != '' &&
          this.formRecherche.value.realisateurControl != undefined
        ) {
          if (this.moviesInDBByAPI == undefined) {
            this.moviesInDBByAPI = new Map();
          }
          this.switch_number = 3;
        } else {
          if (
            this.formRecherche.value.acteurControl != undefined &&
            this.formRecherche.value.acteurControl != '' &&
            this.formRecherche.value.realisateurControl != undefined &&
            this.formRecherche.value.realisateurControl != ''
          ) {
            if (this.moviesInDBByAPI == undefined) {
              this.moviesInDBByAPI = new Map();
            }
            this.switch_number = 4;
          } else {
            if (
              this.formRecherche.value.realisateurControl != undefined &&
              this.formRecherche.value.realisateurControl != ''
            ) {
              if (this.moviesInDBByAPI == undefined) {
                this.moviesInDBByAPI = new Map();
              }
              this.switch_number = 5;
            } else {
              if (
                this.formRecherche.value.acteurControl != undefined &&
                this.formRecherche.value.acteurControl != ''
              ) {
                if (this.moviesInDBByAPI == undefined) {
                  this.moviesInDBByAPI = new Map();
                }
                this.switch_number = 6;
              }
            }
          }
        }
      }
    }

    switch (this.switch_number) {
      case 1:
        await this.getFilmsByYearAndActorsAndRealisator(
          this.formRecherche.value.anneeSortieControl!,
          this.formRecherche.value.acteurControl!,
          this.formRecherche.value.realisateurControl!
        );
        break;
      case 2:
        await this.getFilmsByYearAndActors(
          this.formRecherche.value.anneeSortieControl!,
          this.formRecherche.value.acteurControl!
        );
        break;
      case 3:
        await this.getFilmsByYearAndRealisator(
          this.formRecherche.value.anneeSortieControl!,
          this.formRecherche.value.realisateurControl!
        );
        break;
      case 4:
        await this.getFilmsByActorsAndRealisator(
          this.formRecherche.value.acteurControl!,
          this.formRecherche.value.realisateurControl!
        );
        break;
      case 5:
        await this.getFilmsByRealisator(this.formRecherche.value.realisateurControl!);
        break;
      case 6:
        await this.getFilmsByActors(this.formRecherche.value.acteurControl!);
        break;
      default:
        this.error_message = 'Vous devez remplir au moins un champ';
        break;
    }

    if (
      ((this.formRecherche.value.anneeSortieControl != undefined &&
        this.formRecherche.value.anneeSortieControl != '') ||
        (this.formRecherche.value.realisateurControl != undefined &&
          this.formRecherche.value.realisateurControl != '') ||
        (this.formRecherche.value.acteurControl != undefined &&
          this.formRecherche.value.acteurControl != '')) &&
      this.moviesInDBByAPI != undefined &&
      this.moviesInDB != undefined
    ) {
      this.moviesInDB = this.intersectMaps(
        this.moviesInDB!,
        this.moviesInDBByAPI!
      );
    } else if (this.moviesInDBByAPI != undefined) {
      this.moviesInDB = this.moviesInDBByAPI;
    }

    this.noResult = false;
    this.finalMovieResults = await this.init.initDetailListe2(this.moviesInDB!);

    if (this.finalMovieResults.size == 0) {
      this.noResult = true;
      this.finalMovieResults =
        "Vous n'avez pas de résultats qui correspondent à cette recherche";
    }

    this.finished = true;
    this.spinner = false;
    this.myDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000;
    console.log(`Elapsed time: ${elapsedTime} seconds`);
  }

  // parti du formulaire de recherche

  // REQUETE VERS NOTRE BASE DE DONNEES

  async getFilmsByDateVision(year: string) {
    try {
      const res = await this.filmService.getFilmsOfUserByDateVision(year);
      if (res !== null) {
        if (this.moviesInDB!.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB!, res);
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
        if (this.moviesInDB!.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB!, res);
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
        if (this.moviesInDB!.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB!, res);
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
        if (this.moviesInDB!.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB!, res);
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
        if (this.moviesInDB!.size === 0) {
          this.moviesInDB = res!;
        } else {
          this.moviesInDB = this.intersectMaps(this.moviesInDB!, res);
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
      console.log(this.resList)

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
          this.moviesInDBByAPI!.set(movie_jsoned.omdbID, movie_jsoned.titre);
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
          this.moviesInDBByAPI!.set(movie_jsoned.omdbID, movie_jsoned.titre);
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
          this.moviesInDBByAPI!.set(movie_jsoned.omdbID, movie_jsoned.titre);
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
          this.moviesInDBByAPI!.set(movie_jsoned.omdbID, movie_jsoned.titre);
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
          this.moviesInDBByAPI!.set(movie_jsoned.omdbID, movie_jsoned.titre);
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
          this.moviesInDBByAPI!.set(movie_jsoned.omdbID, movie_jsoned.titre);
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
    const encodedTitle = encodeURIComponent(titre);
    this.router.navigateByUrl('/home/' + encodedTitle);
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
