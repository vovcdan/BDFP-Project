import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Film } from 'app/models/film.model';
import { ListFilm } from 'app/models/listFilm.models';
import { SuppDialogComponent, SuppDialogModel } from 'app/supp-dialog/supp-dialog.component';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-detail-liste',
  templateUrl: './detail-liste.component.html',
  styleUrls: ['./detail-liste.component.scss'],
})
export class DetailListeComponent implements OnInit {
  films: Film[] = [];

  filmsWithAPI: any[] = [];

  curList!: any;

  temp!: any;

  movies!: Map<any, string>;

  singleFilm: Map<any, string> = new Map();
  result: any;

  searchText !: any;

  constructor(
    private filmService: FilmsService,
    private utilService: UtilsService,
    private api: ApiServiceService,
    private router: Router,
    private snack: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.movies = new Map();
    this.curList = this.utilService.getCurrentListe();
    this.filmService
      .getOneList(this.utilService.getUserId(), this.curList.titrelist)
      .subscribe((onelist) => {
        this.temp = onelist;
        this.films = this.temp[0].movies;
        for (let i = 0; i < this.films.length; i++) {
          this.api.getMovieTMDBByIMDBID(this.films[i].omdbID).subscribe((filmAPI: any) => {
            var poster = "https://image.tmdb.org/t/p/w185/" + filmAPI['movie_results'][0].poster_path;
            this.api.getMovieById(this.films[i].omdbID).subscribe((film: any) => {
              console.log(film)
              this.movies.set(film, poster);
            });
          })
        }
        console.log(this.movies)
      });
  }

  openSnackBar(message: string) {
    this.snack.open(message,"", {
      duration: 3000,
    });
  }

  // deleteMovie(imdbID: string, titre: string) {
  //   this.filmService.deleteMovieFromList(this.curList.titrelist, imdbID).subscribe(res => {
  //     this.openSnackBar(titre + ' a été supprimé de la liste ' + res.titrelist)
  //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //       this.router.navigateByUrl('/favs/' + res.titrelist);
  //     })
  //   })
  // }

  afficherFilm(imdbID: string) {
    this.api.getMovieTMDBByIMDBID(imdbID).subscribe((film: any) => {
      var poster = "https://image.tmdb.org/t/p/w185/" + film['movie_results'][0].poster_path;
      console.log(film['movie_results'][0])
      this.api.getMovieById(imdbID).subscribe((filmAPI: any) => {
        this.singleFilm.set(filmAPI, poster);
        this.utilService.setMovie(this.singleFilm);
        this.router.navigateByUrl('/home/' + filmAPI.Title);
      })
    })
  }

  suppDialog(omdbID: string): void {
    this.api.getMovieById(omdbID).subscribe((film) => {
      this.utilService.setMovie(film);
      const message = `Êtes-vous sûr de vouloir supprimer ce film de la liste ?`;
      const dialogData = new SuppDialogModel("Suppression", message);
      this.utilService.setListeOuGlobalSupp(1)
      const dialogRef = this.dialog.open(SuppDialogComponent, {
        maxWidth: "600px",
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        this.result = dialogResult;
      });
    })
  }
}
