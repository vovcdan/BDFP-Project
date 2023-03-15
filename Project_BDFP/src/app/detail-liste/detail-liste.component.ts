import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  listName!: any;

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
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.initialisation();
  }

  async initialisation(){
    this.movies = await this.init.initDetailListe();

    for (const [key, value] of this.movies) {
      let movieFromOMDB_Data = await this.api.getMovieByIdAsync(key);
      let movieFromOMDB = await movieFromOMDB_Data!.json();
      this.movies.get(key).Plot = movieFromOMDB.Plot;
      this.movies.get(key).Actors = movieFromOMDB.Actors;
      this.movies.get(key).Runtime = movieFromOMDB.Runtime;
      this.movies.get(key).release_date = movieFromOMDB.Year;
      this.isMovieInDB(key).then(result => {
        this.movies.get(key).isInDB = result
      });
    }
  }


  openSnackBar(message: string) {
    this.snack.open(message,"", {
      duration: 3000,
    });
  }

  afficherFilm(imdbID: string) {
    let movie;
    for(const [key, value] of this.movies){
      if(key == imdbID){
        movie = {key: key, value: value}
        break
      }
    }
    this.utilService.setMovie(movie)
    this.router.navigateByUrl('/home/' + movie?.value.title)
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

  async isMovieInDB(omdbID: string){ //Promise<boolean>
    const data = await this.filmService.isMovieInDatabase(this.utilService.getUserId(), omdbID);
    console.log(data);
    return data;
  }

  async addMovieFromSharedListToUser(omdbID: string, tmdbID: string, title: string){
    await this.filmService.addFilmToListAsync(title, omdbID, tmdbID, "", "", "", "", "")
    this.openSnackBar(`Le film ${title} a été ajouté`)
    this.router.navigateByUrl('/', { skipLocationChange: true })
    .then(() => {
      this.router.navigateByUrl('/favs/' + this.utilService.getCurrentListeName());
    });
  }
}
