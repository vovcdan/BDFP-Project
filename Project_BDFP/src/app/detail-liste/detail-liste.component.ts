import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Film } from 'app/models/film.model';
import { ListFilm } from 'app/models/listFilm.models';
import { SuppDialogComponent, SuppDialogModel } from 'app/supp-dialog/supp-dialog.component';
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
  films: Film[] = [];

  filmsWithAPI: any[] = [];

  listName!: any;

  temp!: any;

  movies: Map<any, any> = new Map();

  singleFilm: Map<any, string> = new Map();
  result: any;

  searchText !: any;

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
  }

  async initialisation(){
    this.movies = await this.init.initDetailListe();
  }
  

  openSnackBar(message: string) {
    this.snack.open(message,"", {
      duration: 3000,
    });
  }

  afficherFilm(imdbID: string) {
    let movie = new Map<any, any>()
    for(const [key, value] of this.movies){
      if(key == imdbID){
        movie.set(key, value)
        break
      }
    }
    this.utilService.setMovie(movie)
    this.router.navigateByUrl('/home/' + movie.values().next().value.title)
  }

  suppDialog(omdbID: string, title: string): void {
    let value = {
      title: title
    }
    let movie = {key: omdbID, value: value}
    this.utilService.setMovie(movie);
    const message = `Êtes-vous sûr de vouloir supprimer ce film ?`;
    const dialogData = new SuppDialogModel("Suppression", message);
    this.utilService.setListeOuGlobalSupp(1)
    const dialogRef = this.dialog.open(SuppDialogComponent, {
      maxWidth: "600px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }
}
