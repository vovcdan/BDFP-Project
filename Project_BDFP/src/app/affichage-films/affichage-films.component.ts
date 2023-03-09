import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Film } from 'app/models/film.model';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { RechercheService } from 'services/recherche.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-affichage-films',
  templateUrl: './affichage-films.component.html',
  styleUrls: ['./affichage-films.component.scss'],
})
export class AffichageFilmsComponent implements OnInit {
  films: Film[] = [];

  filmsWithAPI: any[] = [];

  movies: Map<any, any> = new Map();
  singleFilm: Map<any, string> = new Map();
  idActor: number = 0;
  moviesNumber: number = 0;
  noPoster: boolean = false;
  fromTMDB: boolean = true;
  searchText!: any;

  constructor(
    private filmService: FilmsService,
    private api: ApiServiceService,
    private router: Router,
    private utilService: UtilsService,
    private rechercheService: RechercheService
  ) { }

  ngOnInit(): void {
    this.init()
    // this.filmService.getListsTitles();
    // this.filmService
    //   .getFilmsByUid(this.utilService.getUserId())
    //   .subscribe((allfilms) => {
    //     this.films = allfilms[0].movies;
    //     this.utilService.setListOfFilms(this.films);
    //     for (let i = 0; i < this.films.length; i++) {
    //       this.api.getMovieTMDBByIMDBID(this.films[i].omdbID).subscribe((res: any) => {
    //         console.log(res)
    //         let title = res['movie_results'][0]?.title;
    //         let release_date = res['movie_results'][0]?.release_date;
    //         let values = {
    //           IMDBID: this.films[i].omdbID,
    //           TMDBID: res['movie_results'][0].id,
    //           Title: title,
    //           Release_Date: release_date,
    //         };
    //         let poster = this.filmService.getPoster(this.films[i].omdbID)
    //         this.movies.set(poster, values)
    //       })



    // this.api
    //   .getMovieTMDBByIMDBID(this.films[i].omdbID)
    //   .subscribe((filmAPI: any) => {
    //     let imdb_id_local = this.films[i].omdbID;
    //     if (filmAPI['movie_results'][0]) {
    //       let id = filmAPI['movie_results'][0].id;
    //       let poster_path = filmAPI['movie_results'][0].poster_path;
    //       let poster: String;
    //       if (poster_path !== null) {
    //         poster = 'https://image.tmdb.org/t/p/w300/' + poster_path;
    //       } else {
    //         poster = '../../assets/no-poster.png';
    //       }
    //       let title = filmAPI['movie_results'][0].title;
    //       let release_date = filmAPI['movie_results'][0].release_date;
    //       let values = {
    //         IMDBID: imdb_id_local,
    //         TMDBID: id,
    //         Poster: poster,
    //         Title: title,
    //         Release_Date: release_date,
    //       };
    //       this.movies.set(filmAPI, values);
    //     } else {
    //       this.api
    //         .getMovieById(this.films[i].omdbID)
    //         .subscribe((filmAPI: any) => {
    //           let id = filmAPI.imdbID;
    //           let poster: String = filmAPI.Poster;
    //           let title = filmAPI.Title;
    //           let release_date = filmAPI.Year;
    //           if (poster != 'N/A') {
    //             let values = {
    //               IMDBID: imdb_id_local,
    //               TMDBID: '',
    //               Poster: poster,
    //               Title: title,
    //               Release_Date: release_date,
    //             };
    //             this.movies.set(filmAPI, values);
    //           } else {
    //             this.noPoster = true;
    //             poster = '../../assets/no-poster.png';
    //             let values = {
    //               IMDBID: imdb_id_local,
    //               TMDBID: '',
    //               Poster: poster,
    //               Title: title,
    //               Release_Date: release_date,
    //             };
    //             this.movies.set(filmAPI, values);
    //           }
    //         });
    //     }
    //   });
    //   }
    // });
  }

  async init() {
    let results = await this.filmService.getFilmsByUidAsync()
    let allMovies = results[0].movies

    for (let i = 0; i < allMovies.length; i++) {
      let data = await this.api.getMovieTMDBByIMDBIDAsync(allMovies[i].omdbID);
      let data_jsoned = await data.json()
      let tmdbMovie = await this.api.getMovieTMDbIdAsync(data_jsoned.movie_results[0]?.id)
      let tmdbMovie_jsoned = await tmdbMovie.json()
      if (tmdbMovie_jsoned.poster_path !== null) {
        let values = {
          title: tmdbMovie_jsoned.title,
          release_date: tmdbMovie_jsoned.release_date,
          poster: 'https://image.tmdb.org/t/p/w300/' + tmdbMovie_jsoned.poster_path,
          tmdbid: tmdbMovie_jsoned.id
        }
        this.movies.set(tmdbMovie_jsoned.imdb_id, values)
      } else {
        let poster = await this.filmService.getPoster(allMovies[i].omdbID)
        let values = {
          title: tmdbMovie_jsoned.title,
          release_date: tmdbMovie_jsoned.release_date,
          poster: poster,
          tmdbid: tmdbMovie_jsoned.id
        }
        this.movies.set(allMovies[i].omdbID, values)
      }
    }

    console.log(this.movies);
  }

}
