import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { UtilsService } from 'services/utils.service';

export interface DialogAjoutFilm {
  title: string;
  french_title: string,
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
  french_title!: string;
  dateVision!: string;
  cinema!: string;
  accompagnateurs!: string;
  avis!: string;
  note!: string;
  films: Film[] = [];
  list: any;
  numberOfFilms!: Observable<number>;
  noMovies!: any
  showFormRecherche: boolean = false;
  formRecherche!: FormGroup;
  resList!: Map<string, number>;
  movieExist: any[] = [];
  switch_number = -1;
  error_message = '';
  // showResultatRecherche = this.utilService.getResultatRecherche()
  showResultatRecherche = true;
  constructor(
    private filmService: FilmsService,
    public diag: MatDialog,
    private utilService: UtilsService,
  ) {}

  ngOnInit(): void {
    this.numberOfFilms = this.getNumberOfFilms();
    this.utilService.setisListShared(false);
    this.hasNoMovies().then(res => {
      this.noMovies = res
    })

    this.formRecherche = new FormGroup({
      titreControl: new FormControl(),
      realisatorControl: new FormControl(),
      yearControl: new FormControl(),
      actorsControl: new FormControl(),
      locationControl: new FormControl(),
      accompagnateursControl: new FormControl(),
    });
  }

  suppFilm(titrefilm: string) {
    this.filmService.deleteMovieDBById(titrefilm);
  }

  getNumberOfFilms(): Observable<number> {
    return this.filmService
      .getFilmsByUid(this.utilService.getUserId())
      .pipe(map((allfilms) => allfilms[0].movies.length));
  }

 async hasNoMovies(){
  let bool = await this.filmService.hasNoMovies()
  console.log(bool)
  return bool
 }

  affichageForm() {
    this.showFormRecherche = !this.showFormRecherche;
    this.showResultatRecherche = !this.showResultatRecherche;
  }

  onClose() {
    this.showFormRecherche = !this.showFormRecherche;
    this.showResultatRecherche = !this.showResultatRecherche;
  }

  openDialog(): void {
    const dialogRef = this.diag.open(ajouterFilm, {
      width: '800px',
      data: {
        title: this.title,
        french_title: this.french_title,
        dateVision: this.dateVision,
        cinema: this.cinema,
        accompagnateurs: this.accompagnateurs,
        avis: this.avis,
        note: this.note,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.title = result;
      this.french_title = result;
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
  omdbSelected: boolean = false;
  messError: boolean = false;
  searchControlNote = new FormControl('', Validators.pattern('^[0-5]$'));
  searchControlDate = new FormControl(
    '',
    Validators.pattern('^19[0-9]{2}|2[0-9]{3}$')
  );

  constructor(
    public dialogRef: MatDialogRef<ajouterFilm>,
    private filmService: FilmsService,
    private api: ApiServiceService,
    private utilService: UtilsService,
    private router: Router,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogAjoutFilm
  ) {}

  ngOnInit(): void {
    this.TMDBInit();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.clickButtonChooseAPIINIT();
    }
  }

  changeBoolTrue() {
    this.omdbSelected = true;
    this.OMDBInit();
  }

  changeBoolFalse() {
    this.omdbSelected = false;
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
          this.api.getMoviesBySearchTerm(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        if (data['Search'] == undefined) {
          this.messError = true;
          this.filteredMoviesOMDB = [];
        } else {
          this.messError = false;
          this.filteredMoviesOMDB = data['Search'];
        }
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
      )
      .subscribe((data: any) => {
        if (data['results'] == undefined) {
          this.messError = true;
          this.filteredMoviesTMDB = [];
        } else {
          this.messError = false;
          this.filteredMoviesTMDB = data['results'];
        }
      });
    this.messError = false;
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
    this.messError = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snack.open(message, '', {
      duration: 3000,
    });
  }

  async ajoutFilmFromOMDB() {
    this.boutonAjoutClicked = true;
    setTimeout(() => {
      this.boutonAjoutClicked = false;
    }, 3000);
    this.filmError = false;
    let IMDBid = this.selectedMovie.imdbID;
    if (
      IMDBid &&
      this.selectedMovie.Title &&
      !(await this.checkIfFilmExistsInList(IMDBid))
    ) {
      this.filmService
        .addFilmToList(
          this.selectedMovie.Title,
          IMDBid,
          '',
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
    } else if (await this.checkIfFilmExistsInList(IMDBid)) {
      this.errorMsgFilmExists = true;
    } else {
      this.filmError = true;
    }
  }

  async ajoutFilmFromTMDB() {
    this.boutonAjoutClicked = true;
    setTimeout(() => {
      this.boutonAjoutClicked = false;
    }, 3000);
    this.filmError = false;
    let tmdbid = this.selectedMovie.id;
    this.api.getMovieTMDbId(tmdbid).subscribe(async (movieTMDB: any) => {
      let imdb_id = movieTMDB.imdb_id;
      if (
        imdb_id &&
        this.selectedMovie.title &&
        !(await this.checkIfFilmExistsInList(imdb_id))
      ) {
        const title = this.data.french_title != undefined ? this.data.french_title : this.selectedMovie.Title
        this.filmService
          .addFilmToList(
            title,
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
              this.selectedMovie.title + ' à été ajouté à votre liste'
            );
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigateByUrl('/home');
                this.dialogRef.close();
              });
          });
      } else if (await this.checkIfFilmExistsInList(imdb_id)) {
        this.errorMsgFilmExists = true;
      } else {
        this.filmError = true;
      }
    });
  }

  async checkIfFilmExistsInList(movieID: any) {
    let bool = await this.filmService.isMovieInDatabase(
      this.utilService.getUserId(),
      movieID
    );
    return bool;
  }
}
