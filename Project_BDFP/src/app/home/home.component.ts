import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Film } from 'app/models/film.model';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { RechercheService } from 'services/recherche.service';
import { UtilsService } from 'services/utils.service';

export interface DialogAjoutFilm {
  title: string;
  dateVision: string;
  cinema: string;
  accompagnateurs: string;
  avis: string;
  note: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isSign: boolean = false;
  userName!: string;
  title!: string;
  dateVision!: string;
  cinema!: string;
  accompagnateurs!: string;
  avis!: string;
  note!: string;
  films: Film[] = [];
  list: any;
  numberOfFilms!: Observable<number>;
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
  switch_number = -1;
  error_message = "";

  constructor(
    private filmService: FilmsService,
    public diag: MatDialog,
    private api: ApiServiceService,
    private utilService: UtilsService,
    private router: Router,
    private rechercheService: RechercheService,
  ) {}

  ngOnInit(): void {
    this.numberOfFilms = this.getNumberOfFilms();
    // this.searchMoviesTMDBTitleSearchAllPages("Ava");
    // this.seachReviewsTMDBAllPages("19995")
    // this.searchMoviesByRealisatorIdAllPages("525")
    // this.searchMoviesByActorIdAllPages("287")
    // this.searchMoviesByActorsAndRealisatorAllPages("11288","525")
    // this.searchMoviesByYearAllPages("2020")
    // this.searchMoviesByYearAndActorsAllPages("2020","11288")
    // this.searchMoviesByYearAndRealisatorAllPages("2020","525")
    // this.searchMoviesByYearAndActorsAndRealisatorAllPages("2020","11288","525")
  }

  async searchMoviesTMDBTitleSearchAllPages(title:string) {
    const tab = await this.api.getMoviesTMDBTitleSearchAllPages(title);
  }

  async seachReviewsTMDBAllPages(id:string) {
    const tab = await this.api.getReviewsTMDBAllPages(id);
  }

  async searchMoviesByRealisatorIdAllPages(id:string){
    const tab = await this.api.getMoviesByRealisatorIdAllPages(id);
  }

  async searchMoviesByActorIdAllPages(id:string) {
    const tab = await this.api.getMoviesByActorIdAllPages(id);
  }

  async searchMoviesByActorsAndRealisatorAllPages(idActor:string, idRealisator:string) {
    const tab = await this.api.getMoviesByActorsAndRealisatorAllPages(idActor, idRealisator);
  }

  async searchMoviesByYearAllPages(year:string) {
    const tab = await this.api.getMoviesByYearAllPages(year);
  }

  async searchMoviesByYearAndActorsAllPages(year:string, idActor:string) {
    const tab = await this.api.getMoviesByYearAndActorsAllPages(year, idActor);
  }

  async searchMoviesByYearAndRealisatorAllPages(year:string, idRealisator:string) {
    const tab = await this.api.getMoviesByYearAndRealisatorAllPages(year, idRealisator);
  }

  async searchMoviesByYearAndActorsAndRealisatorAllPages(year:string, idActor:string, idRealisator:string) {
    const tab = await this.api.getMoviesByYearAndActorsAndRealisatorAllPages(year,idActor, idRealisator);
  }

  suppFilm(titrefilm: string) {
    this.filmService.deleteMovieDBById(titrefilm);
  }

  getNumberOfFilms(): Observable<number> {
    return this.filmService.getFilmsByUid(this.utilService.getUserId()).pipe(
      map(allfilms => allfilms[0].movies.length)
    );
  }

  affichageForm() {
    this.showFormRecherche = !this.showFormRecherche;
  }

  searchedMoviesNotEmpty(){
    if(this.movieExist){
      return true
    } else {
      return false
    }
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
      case (1):
        this.getFilmsByYearAndActorsAndRealisator(this.yearControl.value, this.actorsControl.value, this.realisatorControl.value);
        break;
      case (2):
        this.getFilmsByYearAndActors(this.yearControl.value, this.actorsControl.value);
        break;
      case (3):
        this.getFilmsByYearAndRealisator(this.yearControl.value, this.realisatorControl.value);
        break;
      case (4):
        this.getFilmsByActorsAndRealisator(this.actorsControl.value, this.realisatorControl.value);
        break;
      case (5):
        this.getFilmsByRealisator(this.realisatorControl.value);
        break;
      case (6):
        this.getFilmsByYear(this.yearControl.value);
        break;
      case (7):
        this.getFilmsByActors(this.actorsControl.value);
        break;
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
  getMoviesByYearAndRealisator(value: any, value1: any, resList: Map<string, number>) {
    throw new Error('Method not implemented.');
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

    for (const [key, value] of this.resList) {
      this.api.getMovieTMDbId(value).subscribe((movie: any) => {
        this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
          this.movieExist.push(film)
        })
      })
    }
    this.utilService.setSearchedMovies(this.movieExist)
    console.log(this.movieExist.length);
  }

  async getFilmsByYear(year: string) {
    this.resList = await this.rechercheService.getFilmsByYear(year);

    for (const [key, value] of this.resList) {
      this.api.getMovieTMDbId(value).subscribe((movie: any) => {
        this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
          this.movieExist.push(film)
        })
      })
    }
    this.utilService.setSearchedMovies(this.movieExist)
    console.log(this.movieExist)
  }

  async getFilmsByActors(actors: string) {
    try {
    this.resList = await this.rechercheService.getFilmsByActor(actors);
    console.log(this.resList)

    for (const [key, value] of this.resList) {
      try {
      // this.api.getMovieTMDbId(value).subscribe((movie: any) => {
      //   this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
      //     this.movieExist.push(film)
      //   })
      // })
      console.log(value);
      console.log('before getMovieTMDbIdAsync');
      let movie = await this.api.getMovieTMDbIdAsync(value);
      console.log('after getMovieTMDbIdAsync');
      console.log(movie);
      let data = await movie.json();
      console.log('after movie.json');
      console.log(data);
      let imdb_id = await data.imdb_id;
      console.log('after data.imdb_id');
      console.log(imdb_id);
      let movieDB = await this.filmService.getFilmByOmdbIDAsync(this.utilService.getUserId(), imdb_id);
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

    this.utilService.setSearchedMovies(this.movieExist)
    console.log(this.movieExist)
  } catch (error) {
    console.error(error)
  }
  }

  async getFilmsByYearAndRealisator(year: string, real: string) {
    this.resList = await this.rechercheService.getMoviesByYearAndRealisator(year, real);

    for (const [key, value] of this.resList) {
      this.api.getMovieTMDbId(value).subscribe((movie: any) => {
        this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
          this.movieExist.push(film)
        })
      })
    }
    this.utilService.setSearchedMovies(this.movieExist)
    console.log(this.movieExist)
  }

  async getFilmsByYearAndActors(year: string, actors: string) {
    this.resList = await this.rechercheService.getMoviesByYearAndActors(year, actors);

    for (const [key, value] of this.resList) {
      this.api.getMovieTMDbId(value).subscribe((movie: any) => {
        this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
          this.movieExist.push(film)
        })
      })
    }
    this.utilService.setSearchedMovies(this.movieExist)
    console.log(this.movieExist)
  }

  async getFilmsByActorsAndRealisator(actors: string, real: string) {
    this.resList = await this.rechercheService.getMoviesByActorsAndRealisator(actors, real);

    for (const [key, value] of this.resList) {
      this.api.getMovieTMDbId(value).subscribe((movie: any) => {
        this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
          this.movieExist.push(film)
        })
      })
    }
    this.utilService.setSearchedMovies(this.movieExist)
    console.log(this.movieExist)
  }

  async getFilmsByYearAndActorsAndRealisator(year: string, actors: string, real: string) {
    this.resList = await this.rechercheService.getMoviesByYearAndActorsAndRealisator(year, actors, real);

    for (const [key, value] of this.resList) {
      this.api.getMovieTMDbId(value).subscribe((movie: any) => {
        this.filmService.getFilmByOmdbID(this.utilService.getUserId(), movie.imdb_id).subscribe((film: any) => {
          this.movieExist.push(film)
        })
      })
    }
    this.utilService.setSearchedMovies(this.movieExist)
    console.log(this.movieExist)
  }

  reloadFilms() {
    this.filmService
      .getFilmsByUid(this.utilService.getUserId())
      .subscribe((allfilms) => {
        this.films = allfilms[0].movies;
        this.utilService.setListOfFilms(this.films);
        this.utilService.setListeRecherche(this.films);
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigateByUrl('/home');
          });
      });
  }

  openDialog(): void {
    const dialogRef = this.diag.open(ajouterFilm, {
      width: '800px',
      data: {
        title: this.title,
        dateVision: this.dateVision,
        cinema: this.cinema,
        accompagnateurs: this.accompagnateurs,
        avis: this.avis,
        note: this.note,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.title = result;
      this.dateVision = result;
      this.cinema = result;
      this.accompagnateurs = result;
      this.avis = result;
      this.note = result;
    });
  }
}

@Component({
  selector: 'app-home-dialog',
  templateUrl: 'home.component-dialog.html',
  styleUrls: ['./home.component-dialog.scss'],
})

export class ajouterFilm implements OnInit {

  filmError: boolean = false;

 // currentListAPI: any;

  boutonAjoutClicked: boolean = false;

  searchMoviesCtrl = new FormControl();
  filteredMoviesTMDB: any;
  filteredMoviesOMDB: any;
  isLoading = false;
  errorMsgFilmExists = false;
  minLengthTerm = 1;
  selectedMovie!: any;
  movieValue!: string;
  films: Film[] = [];
  val: boolean = false;
  omdbSelected: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ajouterFilm>, private filmService: FilmsService, private api: ApiServiceService, private utilService: UtilsService, private router: Router, private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogAjoutFilm) {}

    ngOnInit(): void {
      this.OMDBInit();

    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        this.clickButtonChooseAPIINIT();
      }
    }

    changeBoolTrue() {
      this.omdbSelected = true
      this.OMDBInit();
    }

    changeBoolFalse(){
      this.omdbSelected = false
      this.TMDBInit();
    }

    clickButtonChooseAPIINIT() {
      if (this.omdbSelected) {
        this.ajoutFilmFromOMDB();
      } else {
        this.ajoutFilmFromTMDB();
      }
    }


  //OMDB
  OMDBInit() {
    this.omdbSelected = true;
    this.selectedMovie = '';
    this.filteredMoviesOMDB = null;
    this.searchMoviesCtrl.valueChanges
    .pipe(
      filter(res => {
        return res !== null && res.length >= this.minLengthTerm
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      tap(() => {
        this.filteredMoviesTMDB = [];
        this.isLoading = true;
      }),
      switchMap(value => this.api.getMoviesBySearchTerm(value)
        .pipe(
          finalize(() => {
            this.isLoading = false
          }),
        )
      )
    )
    .subscribe((data: any) => {
      if (data['Search'] == undefined) {
        this.filteredMoviesOMDB = [];
      } else {
        this.filteredMoviesOMDB = data['Search'];
      }
      //console.log(this.filteredMoviesOMDB);
    });
  }

  //TMDB
  TMDBInit() {
    this.omdbSelected = false;
    this.selectedMovie = '';
    this.filteredMoviesTMDB = null;
    this.searchMoviesCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.filteredMoviesTMDB = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.api.getMoviesTMDBTitleSearch(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      ).subscribe((data: any) => {
      if (data['results'] == undefined) {
        this.filteredMoviesTMDB = [];
      } else {
        this.filteredMoviesTMDB = data['results'];
      }
      //console.log(this.filteredMoviesTMDB);
    });
  }

  onSelected() {
    this.selectedMovie = this.selectedMovie;
  }

  displayWith(value: any) {
    return value?.Title ? value.Title : value?.title;
  }

  clearSelection() {
    this.selectedMovie = '';
    this.filteredMoviesOMDB = [];
    this.filteredMoviesTMDB = [];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snack.open(message, '', {
      duration: 3000,
    });
  }

  ajoutFilmFromOMDB() {
    this.boutonAjoutClicked = true;
    setTimeout(() => {
      this.boutonAjoutClicked = false;
    }, 3000);
    this.filmError = false;
    var IMDBid = this.selectedMovie.imdbID;
    if (IMDBid && this.selectedMovie.Title && !this.checkIfFilmExistsInList(IMDBid)) {
      this.filmService
        .addFilmToList(
          this.selectedMovie.Title,
          IMDBid,
          "",
          this.utilService.getUserId(),
          this.data.dateVision,
          this.data.cinema,
          this.data.accompagnateurs,
          this.data.avis,
          this.data.note
        )
        .subscribe((film) => {
          this.openSnackBar(
            this.selectedMovie.Title + ' à été ajouté à votre liste'
          );
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigateByUrl('/home');
              this.dialogRef.close();
            });
        });
    } else if (this.checkIfFilmExistsInList(IMDBid)) {
      this.errorMsgFilmExists = true;
    } else {
      this.filmError = true;
    }
  }

  ajoutFilmFromTMDB() {
    console.log(this.selectedMovie);
    this.boutonAjoutClicked = true;
    setTimeout(() => {
      this.boutonAjoutClicked = false;
    }, 3000);
    this.filmError = false;
    var tmdbid = this.selectedMovie.id;
    console.log(tmdbid);
    this.api.getMovieTMDbId(tmdbid).subscribe((movieTMDB: any) => {
      console.log(movieTMDB);
      var imdb_id = movieTMDB.imdb_id;
      if (imdb_id && this.selectedMovie.title && !this.checkIfFilmExistsInList(imdb_id)) {
        this.filmService.addFilmToList(
            this.selectedMovie.title,
            imdb_id,
            tmdbid,
            this.utilService.getUserId(),
            this.data.dateVision,
            this.data.cinema,
            this.data.accompagnateurs,
            this.data.avis,
            this.data.note
          )
          .subscribe((film) => {
            this.openSnackBar(
              this.selectedMovie.title +
                ' à été ajouté à votre liste'
            );
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigateByUrl('/home');
                this.dialogRef.close();
              });
          });
      } else if (this.checkIfFilmExistsInList(imdb_id)) {
        this.errorMsgFilmExists = true;
      } else {
        this.filmError = true;
      }
    });
  }

  checkIfFilmExistsInList(movieID: any): boolean {
    this.val = false;
    this.films = this.utilService.getListOfFilms();
    for (let i = 0; i < this.films.length; i++) {
      if (this.films[i].omdbID == movieID) {
        this.val = true;
        break;
      }
    }
    return this.val;
  }
}
