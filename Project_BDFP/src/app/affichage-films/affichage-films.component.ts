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
    // this.filmService.getListsTitles();
    this.filmService
      .getFilmsByUid(this.utilService.getUserId())
      .subscribe((allfilms) => {
        this.films = allfilms[0].movies;
        this.utilService.setListOfFilms(this.films);
        for (let i = 0; i < this.films.length; i++) {
          this.api
            .getMovieTMDBByIMDBID(this.films[i].omdbID)
            .subscribe((filmAPI: any) => {
              let imdb_id_local = this.films[i].omdbID;
              if (filmAPI['movie_results'][0]) {
                let id = filmAPI['movie_results'][0].id;
                let poster_path = filmAPI['movie_results'][0].poster_path;
                let poster: String;
                if (poster_path !== null) {
                  poster = 'https://image.tmdb.org/t/p/w300/' + poster_path;
                } else {
                  poster = '../../assets/no-poster.png';
                }
                let title = filmAPI['movie_results'][0].title;
                let release_date = filmAPI['movie_results'][0].release_date;
                let values = {
                  IMDBID: imdb_id_local,
                  TMDBID: id,
                  Poster: poster,
                  Title: title,
                  Release_Date: release_date,
                };
                this.movies.set(filmAPI, values);
              } else {
                this.api
                  .getMovieById(this.films[i].omdbID)
                  .subscribe((filmAPI: any) => {
                    let id = filmAPI.imdbID;
                    let poster: String = filmAPI.Poster;
                    let title = filmAPI.Title;
                    let release_date = filmAPI.Year;
                    if (poster != 'N/A') {
                      let values = {
                        IMDBID: imdb_id_local,
                        TMDBID: '',
                        Poster: poster,
                        Title: title,
                        Release_Date: release_date,
                      };
                      this.movies.set(filmAPI, values);
                    } else {
                      this.noPoster = true;
                      poster = '../../assets/no-poster.png';
                      let values = {
                        IMDBID: imdb_id_local,
                        TMDBID: '',
                        Poster: poster,
                        Title: title,
                        Release_Date: release_date,
                      };
                      this.movies.set(filmAPI, values);
                    }
                  });
              }
            });
        }
      });
  }

  clickFilm(infoFilm: any) {
    let poster = infoFilm.Poster;
    this.api.getMovieById(infoFilm.IMDBID).subscribe((filmOMDB: any) => {
      this.singleFilm.set(filmOMDB, poster);
      this.utilService.setMovie(this.singleFilm);
      this.router.navigateByUrl('/home/' + filmOMDB.Title);
    });
  }
}
