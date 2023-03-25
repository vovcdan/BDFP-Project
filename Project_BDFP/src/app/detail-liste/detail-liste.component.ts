import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  SuppDialogComponent,
  SuppDialogModel,
} from 'app/supp-dialog/supp-dialog.component';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { InitService } from 'services/init.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-detail-liste',
  templateUrl: './detail-liste.component.html',
  styleUrls: ['./detail-liste.component.scss'],
})
export class DetailListeComponent implements OnInit {
  listName!: any;

  movies: Map<any, any> = new Map();

  singleFilm: Map<any, string> = new Map();

  result: any;

  searchText!: any;

  nbrFilms!: number;

  showAide: boolean = false;

  loading!: boolean

  containsPartageePar!: boolean

  constructor(
    private filmService: FilmsService,
    private init: InitService,
    private utilService: UtilsService,
    private api: ApiServiceService,
    private router: Router,
    private snack: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initialisation();
    this.isTitleContainsPartageePar()
  }

  async initialisation() {
    this.loading = true;
    this.movies = await this.init.initDetailListe();
    if (this.movies.size == 0) {
      this.showAide = true
    } else {
      this.showAide = false
    }


    for (const [key, value] of this.movies) {
      let movieFromOMDB_Data = await this.api.getMovieByIdAsync(key);
      let movieFromOMDB = await movieFromOMDB_Data!.json();
      this.movies.get(key).Plot = movieFromOMDB.Plot;
      this.movies.get(key).Actors = movieFromOMDB.Actors;
      this.movies.get(key).Runtime = movieFromOMDB.Runtime;
      this.movies.get(key).release_date = movieFromOMDB.Year;
      this.isMovieInDB(key).then((result) => {
        this.movies.get(key).isInDB = result;
      });
    }
    this.loading = false;
  }

  get spinnerStyle() { return {color: 'Orange'} }

  openSnackBar(message: string) {
    this.snack.open(message, '', {
      duration: 3000,
    });
  }

  afficherFilm(imdbID: string) {
    let movie;
    for (const [key, value] of this.movies) {
      if (key == imdbID) {
        movie = { key: key, value: value };
        break;
      }
    }
    this.utilService.setMovie(movie);
    this.utilService.setIsListCommon(false)
    const encodedTitle = encodeURIComponent(movie?.value.title);
    this.router.navigateByUrl('/home/' + encodedTitle);

  }

  deleteFromListOrDeleteFromCommonList(omdbID: string, title: string){
    let isListCommon = this.utilService.getIsListCommon()
    if(isListCommon){
      this.openDeleteFromCommonListDialog(omdbID, title)
    } else {
      this.openDeleteFromListDialog(omdbID, title)
    }
  }

  openDeleteFromListDialog(omdbID: string, title: string): void {
    let value = {
      title: title,
    };
    let movie = { key: omdbID, value: value };
    this.utilService.setMovie(movie);
    const message = `Êtes-vous sûr de vouloir supprimer ce film ?`;
    const dialogData = new SuppDialogModel('Suppression', message);
    this.utilService.setListeOuGlobalSupp(1);
    const dialogRef = this.dialog.open(SuppDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
    });
  }

  openDeleteFromCommonListDialog(omdbID: string, title: string): void {
    let value = {
      title: title,
    };
    let movie = { key: omdbID, value: value };
    this.utilService.setMovie(movie);
    const message = `Êtes-vous sûr de vouloir supprimer ce film ?`;
    const dialogData = new SuppDialogModel('Suppression', message);
    this.utilService.setListeOuGlobalSupp(4);
    const dialogRef = this.dialog.open(SuppDialogComponent, {
      maxWidth: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
    });
  }

  async isMovieInDB(omdbID: string){ //Promise<boolean>
    const data = await this.filmService.isMovieInDatabase(this.utilService.getUserId(), omdbID);
    return data;
  }

  isTitleContainsPartageePar(){
    this.containsPartageePar = this.utilService.getListName().includes("partagee par")
    console.log(this.containsPartageePar)
  }

  async addMovieFromSharedListToUser(
    omdbID: string,
    tmdbID: string,
    title: string
  ) {
    const dialogRef = this.dialog.open(AddmMovieFromSharedListToUser);

    dialogRef.afterClosed().subscribe(async (result) => {
      await this.filmService.addFilmToListAsync(title, omdbID, tmdbID, "", "", "", "", "")
      this.openSnackBar(`Le film ${title} a été ajouté`)
      if(result){
        this.utilService.setisListShared(false)
        this.afficherFilm(omdbID)
      } else {
        this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => {
          const encodedTitle = encodeURIComponent(this.utilService.getCurrentListeName());
          this.router.navigateByUrl('/favs/' + encodedTitle);
        });
      }
    });
  }

  openAddMovieFromSharedListToUserDialog() {
    const dialogRef = this.dialog.open(AddmMovieFromSharedListToUser);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'add-movie-from-shared-list-to-user',
  templateUrl: './add-movie-from-shared-list-to-user.html',
})
export class AddmMovieFromSharedListToUser {
  constructor(public dialogRef: MatDialogRef<AddmMovieFromSharedListToUser>) {}
}
