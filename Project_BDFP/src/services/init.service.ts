import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { FilmsService } from './films.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  movies!: Map<any, any>;

  constructor(
    private filmService: FilmsService,
    private api: ApiServiceService,
    private utilService: UtilsService
  ) {}

  async initAffichageFilms() {
    let omdbIDS = [];
    this.movies = new Map();
    let results = await this.filmService.getFilmsByUidAsync();

    for (let movie of results[0].movies) {
      omdbIDS.push([movie.omdbID, movie.titre]);
    }

    this.movies = await this.getMapWithInfoAndPoster(omdbIDS);
    return this.movies;
  }

  async initDetailListe() {
    this.movies = new Map();
    let isListCommon = this.utilService.getIsListCommon()
    let omdbIDS = [];
    let listName = this.utilService.getListName();
    let list = undefined
    if(isListCommon){
      list = await this.filmService.getOneCommonList(listName);
    } else {
      list = await this.filmService.getOneListAsync(listName);
    }
    if (list.movies) {
      for (let movie of list.movies) {
        omdbIDS.push([movie.omdbID, movie.titre]);
      }
      this.movies = await this.getMapWithInfoAndPoster(omdbIDS);
    }
    return this.movies;
  }

  async initDetailListe2(movies: Map<any, any>) {
    let omdbIDS = [];
    for (const [key, value] of movies) {
      omdbIDS.push([key, value]);
    }

    let res = new Map<any, any>();
    res = await this.getMapWithInfoAndPoster(omdbIDS);

    return res;
  }

  async getMapWithInfoAndPoster(movies: any) {
    let res = new Map<any, any>();

    for (let i = 0; i < movies.length; i++) {
      let poster = '';
      let tmdbMovie = await this.api.getMovieTMDBByIMDBIDAsync(movies[i][0]);
      let tmdbMovie_jsoned = await tmdbMovie.json();
      if (tmdbMovie_jsoned.movie_results[0]) {
        poster =
          tmdbMovie_jsoned.movie_results[0].poster_path !== null
            ? 'https://image.tmdb.org/t/p/w300/' +
              tmdbMovie_jsoned.movie_results[0].poster_path
            : '../assets/no-poster.png';

        let title: string = movies[i][1] != undefined ? movies[i][1] : tmdbMovie_jsoned.movie_results[0].title;
        let release_date: string =
          tmdbMovie_jsoned.movie_results[0].release_date;
        let tmdbid: string = tmdbMovie_jsoned.movie_results[0].id;

        let values = {
          title: title,
          release_date: release_date,
          poster: poster,
          tmdbid: tmdbid,
        };
        res.set(movies[i][0], values);
      } else {
        let omdbMovie = await this.api.getMovieByIdAsync(movies[i][0]);
        let omdbMovie_jsoned = await omdbMovie.json();
        poster =
          omdbMovie_jsoned.Poster != 'N/A'
            ? omdbMovie_jsoned.Poster
            : '../assets/no-poster.png';

        let title: string = movies[i][1] != undefined ? movies[i][1] : omdbMovie_jsoned.Title;
        let release_date: string = omdbMovie_jsoned.Released;

        let values = {
          title: title,
          release_date: release_date,
          poster: poster,
          tmdbid: '',
        };
        res.set(movies[i][0], values);
      }
    }
    return res;
  }
}
