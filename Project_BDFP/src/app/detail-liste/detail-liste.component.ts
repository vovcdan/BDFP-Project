import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Film } from 'app/models/film.model';
import { ListFilm } from 'app/models/listFilm.models';
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

  movies: Map<any, string> = new Map();

  constructor(
    private filmService: FilmsService,
    private utilService: UtilsService,
    private api: ApiServiceService,
    private router: Router,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.curList = this.utilService.getCurrentListe();
    this.filmService
      .getOneList(this.utilService.getUserId(), this.curList.titrelist)
      .subscribe((onelist) => {
        this.temp = onelist;
        this.films = this.temp[0].movies;
        for (let i = 0; i < this.films.length; i++) {
          this.api.getMovieTMDBByIMDBID(this.films[i].omdbID).subscribe((filmAPI: any) => {
            var id = filmAPI['movie_results'][0].id;
            var poster = "https://image.tmdb.org/t/p/w185/" + filmAPI['movie_results'][0].poster_path;
            this.api.getMovieTMDbId(id).subscribe((film: any) => {
              this.movies.set(film, poster);
            })
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

  deleteMovie(imdbID: string, titre: string) {
    this.filmService.deleteMovieFromList(this.curList.titrelist, imdbID).subscribe(res => {
      this.openSnackBar(titre + ' a été supprimé de la liste ' + res.titrelist)
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl('/favs/' + res.titrelist);
      })
    })
  }

  afficherFilm(movie: string, titre: string) {
    this.utilService.setMovie(movie);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/home/' + titre);
    })
  }
}
