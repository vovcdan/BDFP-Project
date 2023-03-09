import { Injectable } from '@angular/core';
import { ApiServiceService } from './api-service.service';
import { FilmsService } from './films.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  movies!: Map<any, any>

  constructor(private filmService: FilmsService, private api: ApiServiceService, private utilService: UtilsService) { }

  async initAffichageFilms() {
    let omdbIDS = []
    this.movies = new Map();
    let results = await this.filmService.getFilmsByUidAsync();

    for(let movie of results[0].movies){
      omdbIDS.push(movie.omdbID)
    }
    
    this.movies = await this.getMapWithInfoAndPoster(omdbIDS)
    return this.movies
  }

  async initDetailListe() {
    this.movies = new Map();
    let omdbIDS = []
    let listName = this.utilService.getListName()
    let list = await this.filmService.getOneListAsync(listName)
    for(let movie of list.movies){
      omdbIDS.push(movie.omdbID)
    }
    this.movies = await this.getMapWithInfoAndPoster(omdbIDS)
    return this.movies
  }

   async getMapWithInfoAndPoster(omdbIDS: any){
    let res = new Map<any, any>();

    for (let i = 0; i < omdbIDS.length; i++) {
      let poster = '';
      let tmdbMovie = await this.api.getMovieTMDBByIMDBIDAsync(
        omdbIDS[i]
      );
      let tmdbMovie_jsoned = await tmdbMovie.json();
      if (tmdbMovie_jsoned.movie_results[0]) {
        poster =
          tmdbMovie_jsoned.movie_results[0].poster_path !== null
            ? 'https://image.tmdb.org/t/p/w300/' + tmdbMovie_jsoned.movie_results[0].poster_path
            : '../assets/no-poster.png';

        let title: string = tmdbMovie_jsoned.movie_results[0].title
        let release_date: string = tmdbMovie_jsoned.movie_results[0].release_date
        let tmdbid: string =  tmdbMovie_jsoned.movie_results[0].id

        let values = {
          title: title,
          release_date: release_date,
          poster: poster,
          tmdbid: tmdbid,
        };
        res.set(omdbIDS[i], values);
      } else {
        let omdbMovie = await this.api.getMovieByIdAsync(omdbIDS[i]);
        let omdbMovie_jsoned = await omdbMovie.json();
        poster =
          omdbMovie_jsoned.Poster != 'N/A'
            ? omdbMovie_jsoned.Poster
            : '../assets/no-poster.png';

            let title: string = omdbMovie_jsoned.Title
            let release_date: string = omdbMovie_jsoned.Released

        let values = {
          title: title,
          release_date: release_date,
          poster: poster,
          tmdbid: '',
        };
        res.set(omdbIDS[i], values);
      }
    }
    return res
   }
}
