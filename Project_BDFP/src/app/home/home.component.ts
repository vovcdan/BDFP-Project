import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  constructor(
    private filmService: FilmsService,
    public diag: MatDialog,
    private api: ApiServiceService,
    private utilService: UtilsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.numberOfFilms = this.getNumberOfFilms();
    this.searchMoviesTMDBTitleSearchAllPages("Ava");
    this.seachReviewsTMDBAllPages("19995")
    this.searchMoviesByRealisatorIdAllPages("525")
    this.searchMoviesByActorIdAllPages("287")
    this.searchMoviesByActorsAndRealisatorAllPages("11288","525")
    this.searchMoviesByYearAllPages("2020")
    this.searchMoviesByYearAndActorsAllPages("2020","11288")
    this.searchMoviesByYearAndRealisatorAllPages("2020","525")
    this.searchMoviesByYearAndActorsAndRealisatorAllPages("2020","11288","525")
  }

  async searchMoviesTMDBTitleSearchAllPages(title:string) {
    const tab = await this.api.getMoviesTMDBTitleSearchAllPages(title);
    console.log("ava");
    console.log(tab);
  }

  async seachReviewsTMDBAllPages(id:string) {
    const tab = await this.api.getReviewsTMDBAllPages(id);
    console.log("Revues pour le film avatar");
    console.log(tab)
  }

  async searchMoviesByRealisatorIdAllPages(id:string){
    const tab = await this.api.getMoviesByRealisatorIdAllPages(id);
    console.log("Realisé par Nolan")
    console.log(tab)
  }

  async searchMoviesByActorIdAllPages(id:string) {
    const tab = await this.api.getMoviesByActorIdAllPages(id);
    console.log("Joué par Brad Pitt")
    console.log(tab)
  }

  async searchMoviesByActorsAndRealisatorAllPages(idActor:string, idRealisator:string) {
    const tab = await this.api.getMoviesByActorsAndRealisatorAllPages(idActor, idRealisator);
    console.log("Realisé par Nolan et joué par robert pattinson")
    console.log(tab)
  }

  async searchMoviesByYearAllPages(year:string) {
    const tab = await this.api. getMoviesByYearAllPages(year);
    console.log("Realisé en 2020")
    console.log(tab)
  }

  async searchMoviesByYearAndActorsAllPages(year:string, idActor:string) {
    const tab = await this.api.getMoviesByYearAndActorsAllPages(year, idActor);
    console.log("Realisé en 2020 avec Robert Pattinson")
    console.log(tab)
  }

  async searchMoviesByYearAndRealisatorAllPages(year:string, idRealisator:string) {
    const tab = await this.api.getMoviesByYearAndRealisatorAllPages(year, idRealisator);
    console.log("Realisé par Nolan en 2020")
    console.log(tab)
  }

  async searchMoviesByYearAndActorsAndRealisatorAllPages(year:string, idActor:string, idRealisator:string) {
    const tab = await this.api.getMoviesByYearAndActorsAndRealisatorAllPages(year,idActor, idRealisator);
    console.log("Realisé par Nolan en 2020 avec Robert Pattinson")
    console.log(tab)
  }

  suppFilm(titrefilm: string) {
    this.filmService.deleteMovieDBById(titrefilm);
  }

  getNumberOfFilms(): Observable<number> {
    return this.filmService.getFilmsByUid(this.utilService.getUserId()).pipe(
      map(allfilms => allfilms[0].movies.length)
    );
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
