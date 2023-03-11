import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Film } from 'app/models/film.model';
import { Router } from '@angular/router';
import { UtilsService } from 'services/utils.service';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-supp-dialog',
  templateUrl: './supp-dialog.component.html',
  styleUrls: ['./supp-dialog.component.scss'],
})
export class SuppDialogComponent implements OnInit {
  title: string;
  message: string;
  films: Film[] = [];
  imdbIdAndMovieTitle: string[] = [];
  filmsWithAPI: any[] = [];
  curList!: any;
  currentFilmInfos: any;
  listfilm: Film[] = [];
  currentFilm: any;
  temp!: any;
  movies: Map<any, string> = new Map();
  singleFilm: Map<any, string> = new Map();
  result: any;
  switch!: any;
  moviesTitles: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<SuppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuppDialogModel,
    private utilService: UtilsService,
    private api: ApiServiceService,
    private router: Router,
    private filmService: FilmsService,
    private snack: MatSnackBar,
    private loc: Location
  ) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit(): void {
    this.curList = this.utilService.getCurrentListe();
    this.currentFilm = this.utilService.getMovie();
  }

  back() {
    this.loc.back();
  }

  closeFenetre(): void {
    this.dialogRef.close(false);
  }

  openSnackBar(message: string) {
    this.snack.open(message, '', {
      duration: 3000,
    });
  }

  deleteMovieFromList() {
    let movie = this.currentFilm;

    this.filmService
      .deleteMovieByIdAsync(this.currentFilm.key)
      .then(() => {
        this.openSnackBar(movie.value.title + ' à été supprimé');
        this.back();
      })
      .catch((error) => {
        console.error(
          `Erreur lors de la suppression du film ${movie.value.title}`,
          error
        );
      });
  }

  deleteMovieGlob() {
    let movie = this.currentFilm;

    this.filmService
      .deleteMovieByIdAsync(this.currentFilm.key)
      .then(() => {
        this.filmService
          .deleteMovieFromAllLists(this.currentFilm.key)
          .then(() => {
            this.openSnackBar(movie.value.title + ' à été supprimé');
            this.back();
          })
          .catch((error) => {
            console.error(
              `Erreur lors de la suppression du film ${movie.value.title}`,
              error
            );
          });
      })
      .catch((error) => {
        console.error(
          `Erreur lors de la suppression du film ${movie.value.title}`,
          error
        );
      });
  }

  deleteListe() {
    let inst = this.utilService.getCurrentListe();
    this.filmService.deleteListOfAllLists(inst._id).subscribe((del) => {
      this.openSnackBar('Liste ' + inst.titrelist + ' a été supprimé');
      this.loc.back();
    });
  }

  choixDelete() {
    this.switch = this.utilService.getListeOuGlobalSupp();
    if (this.switch == 1) {
      this.deleteMovieFromList();
    } else if (this.switch == 2) {
      this.deleteMovieGlob();
    } else if (this.switch == 3) {
      this.deleteListe();
    }
  }
}

export class SuppDialogModel {
  constructor(public title: string, public message: string) {}
}
