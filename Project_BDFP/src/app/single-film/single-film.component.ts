import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Film } from 'app/models/film.model';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-single-film',
  templateUrl: './single-film.component.html',
  styleUrls: ['./single-film.component.scss']
})
export class SingleFilmComponent implements OnInit {

  currentFilm: any;

  listfilm: Film[] = [];

  currentFilmInfos: any;

  actors: Map<string, string> = new Map();

  realisator!: string;

  constructor(private filmService: FilmsService, private loc: Location, private utilService: UtilsService, private snack: MatSnackBar, private api: ApiServiceService) { }

  ngOnInit(): void {
    this.currentFilm = this.utilService.getMovie();
    console.log(this.currentFilm)
    this.filmService.getFilmsByUid(this.utilService.getUserId()).subscribe((listeFilm) => {
      this.listfilm = listeFilm[0].movies;
      for(let i = 0; i < this.listfilm.length; i++) {
        if(this.listfilm[i].omdbID == this.currentFilm.imdb_id || this.listfilm[i].omdbID == this.currentFilm.imdbID) {
          this.currentFilmInfos = this.listfilm[i];
          return;
        }
      }
    });
    this.getRealisateur();
  }

  back() {
    this.loc.back();
  }

  openSnackBar(message: string) {
    this.snack.open(message,"", {
      duration: 3000,
    });
  }

  deleteMovie(){
    this.filmService.deleteMovieDBById(this.currentFilmInfos.titre).subscribe(film => {
      this.openSnackBar(this.currentFilmInfos.titre + ' à été supprimé')
      this.back();
    })
  }

  chercherActeurs() {
    //TODO: Verifier que le premier if marche
    if(this.currentFilm.tmdbID) {
      this.api.getCastTMDB(this.currentFilm.tmdbID).subscribe((actors: any) => {
        actors.cast.forEach((actor: any) => { 
          this.actors.set(actor.name, actor.character)
        })
        console.log(actors)
      })
    } else {
      this.api.getMovieTMDBByIMDBID(this.currentFilm.imdbID).subscribe((film: any) => {
        var id = film['movie_results'][0].id;
        this.api.getMovieTMDbId(id).subscribe((film: any) => {
          this.api.getCastTMDB(film.id).subscribe((actors: any) => {
            actors.cast.forEach((actor: any) => { 
              this.actors.set(actor.name, actor.character)
            })
            console.log(this.actors)
          })
        })
      })
    }
  }

  getReviews() {
    this.api.getMovieTMDBByIMDBID(this.currentFilm.imdbID).subscribe((film: any) => {
      var id = film['movie_results'][0].id;
      this.api.getMovieTMDbId(id).subscribe((film: any) => {
        this.api.getReviewsTMDB(film.id).subscribe((reviews: any) => {
          reviews.results.forEach((review: any) => {
            console.log(review)
          })
        })
      })
    })
  }

  getRealisateur() {
    //console.log(this.currentFilm)
    this.api.getMovieTMDBByIMDBID(this.currentFilm.imdbID).subscribe((film: any) => {
      console.log(film)
      if(film['movie_results'].length != 0) {
        var id = film['movie_results'][0].id;
        this.api.getMovieTMDbId(id).subscribe((film: any) => {
          this.api.getCreditsTMDB(film.id).subscribe((credits: any) => {
            credits.crew.forEach((crew: any) => {
              if(crew.job == "Director") {
                this.realisator = crew.name;
                console.log("getRealisateur : "+this.realisator)
              }
            })
          })
        })
      }
    })
  }

}
