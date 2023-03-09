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
  ) {}

  ngOnInit(): void {
    this.init();
  }

  async init() {
    let results = await this.filmService.getFilmsByUidAsync();
    let allMovies = results[0].movies;

    for (let i = 0; i < allMovies.length; i++) {
      let poster = '';
      let tmdbMovie = await this.api.getMovieTMDBByIMDBIDAsync(allMovies[i].omdbID);
      let tmdbMovie_jsoned = await tmdbMovie.json();
      console.log(tmdbMovie_jsoned.movie_results[0]);
      if(tmdbMovie_jsoned.movie_results[0]){
        if(tmdbMovie_jsoned.movie_results[0].poster_path !== null){
          poster = tmdbMovie_jsoned.movie_results[0].poster_path
        } else {
          poster = '../../assets/no-poster.png';
        }
        let values = {
          title: tmdbMovie_jsoned.movie_results[0].title,
          release_date: tmdbMovie_jsoned.movie_results[0].release_date,
          poster: 'https://image.tmdb.org/t/p/w300' + poster,
          tmdbid: tmdbMovie_jsoned.movie_results[0].id,
        };
        this.movies.set(allMovies[i].omdbID, values);
      } else {
        let omdbMovie = await this.api.getMovieByIdAsync(allMovies[i].omdbID)
        let omdbMovie_jsoned = await omdbMovie.json()
        console.log(omdbMovie_jsoned)
        if(omdbMovie_jsoned.Poster != 'N/A'){
          poster = omdbMovie_jsoned.Poster
        } else {
          poster = '../../assets/no-poster.png';
        }
        let values = {
          title: omdbMovie_jsoned.Title,
          release_date: omdbMovie_jsoned.Released,
          poster: poster,
          tmdbid: "",
        };
        this.movies.set(allMovies[i].omdbID, values);
      }
    }

    console.log(this.movies);
  }
}
