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
  styleUrls: ['./supp-dialog.component.scss']
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


  constructor(public dialogRef: MatDialogRef<SuppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuppDialogModel,
    private utilService: UtilsService,
    private api: ApiServiceService,
    private router: Router,
    private filmService: FilmsService,
    private snack: MatSnackBar,
    private loc: Location) { 
    this.title = data.title;
    this.message = data.message;
    
  }

  ngOnInit(): void {
    this.curList = this.utilService.getCurrentListe();
    this.currentFilm = this.utilService.getMovie();
    console.log(this.curList);
    console.log("Le film ::::: " + this.currentFilm.Title);
    this.imdbIdAndMovieTitle = this.utilService.getImdbIdAndMovieTitle();
    this.filmService.getFilmsByUid(this.utilService.getUserId()).subscribe((listeFilm) => {
      this.listfilm = listeFilm[0].movies;
    });
  }

  back() {
    this.loc.back();
  }

  closeFenetre(): void {
    this.dialogRef.close(false);
  }

  openSnackBar(message: string) {
    this.snack.open(message,"", {
      duration: 3000,
    });
  }

  deleteMovieList() {
    this.filmService.deleteMovieFromList(this.curList.titrelist, this.currentFilm.imdbID).subscribe(res => {
      this.openSnackBar(this.currentFilm.Title + ' a été supprimé de la liste ' + res.titrelist)
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl('/favs/' + res.titrelist);
      })
    })
    this.dialogRef.close(false)
  }

  deleteMovieGlob(){
    this.moviesTitles = this.utilService.getMoviesTitles();
    let title = this.currentFilm.Title;
    this.filmService.deleteMovieDBById(this.currentFilm.imdbID).subscribe(film => {
      this.moviesTitles.forEach((element: string) => {
        if(!element.includes("partagee par")){
          this.filmService.deleteMovieFromList(element, this.currentFilm.imdbID).subscribe(films => {})
        }
      })
      this.openSnackBar(title + ' à été supprimé')
      this.back();
    })
  }

  deleteListe() {
    let inst = this.utilService.getCurrentListe();
    this.filmService.deleteListOfAllLists(inst._id).subscribe(del => {
      this.openSnackBar('Liste ' + inst.titrelist + " a été supprimé")
      this.loc.back();
    })
  }
 
  choixDelete(){
    this.switch = this.utilService.getListeOuGlobalSupp()
    if (this.switch == 1){
      console.log("JE SUPPRIME LE FILM DE LA LISTE")
      this.deleteMovieList()
    }
    else if(this.switch == 2) {
      console.log("JE SUPPRIME LE FILM DE PARTOUUUUUT")
      this.deleteMovieGlob()
    }
    else if(this.switch == 3){
      this.deleteListe()
    }
  }
}

export class SuppDialogModel {
  constructor(public title: string, public message: string) {
}
}

