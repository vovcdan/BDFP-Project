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

  poster!: string;

  listfilm: Film[] = [];

  currentFilmInfos: any;

  actors: Map<string, string> = new Map();

  realisator!: string;

  constructor(private filmService: FilmsService, private loc: Location, private utilService: UtilsService, private snack: MatSnackBar, private api: ApiServiceService) { }

  ngOnInit(): void {
    this.currentFilm = this.utilService.getMovie();
    console.log(this.currentFilm);
    this.poster = this.currentFilm.values().next().value;
    this.currentFilm = this.currentFilm.keys().next().value;
    this.filmService.getFilmsByUid(this.utilService.getUserId()).subscribe((listeFilm) => {
      this.listfilm = listeFilm[0].movies;
      for(let i = 0; i < this.listfilm.length; i++) {
        if(this.listfilm[i].omdbID == this.currentFilm.imdbID) {
          this.currentFilmInfos = this.listfilm[i];
          console.log(this.currentFilmInfos)
          return;
        }
      }
    });
    this.getRealisateur();
    this.chercherActeurs();
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

   this.filmService.deleteMovieFromAllLists(this.currentFilmInfos.omdbID).subscribe(films => {
      this.openSnackBar(this.currentFilmInfos.titre + ' à été supprimé de toutes les listes')
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
      })
    } else {
      this.api.getMovieTMDBByIMDBID(this.currentFilm.imdbID).subscribe((film: any) => {
        var id = film['movie_results'][0].id;
        this.api.getMovieTMDbId(id).subscribe((film: any) => {
          this.api.getCastTMDB(film.id).subscribe((actors: any) => {
            actors.cast.forEach((actor: any) => { 
              this.actors.set(actor.name, actor.character)
            })
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
    this.api.getMovieTMDBByIMDBID(this.currentFilm.imdbID).subscribe((film: any) => {
      console.log(film)
      if(film['movie_results'].length != 0) {
        var id = film['movie_results'][0].id;
        this.api.getMovieTMDbId(id).subscribe((film: any) => {
          this.api.getCreditsTMDB(film.id).subscribe((credits: any) => {
            credits.crew.forEach((crew: any) => {
              if(crew.job == "Director") {
                this.realisator = crew.name;
              }
            })
          })
        })
      }
    })
  }

}
