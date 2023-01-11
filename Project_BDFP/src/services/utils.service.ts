import { Injectable } from '@angular/core';
import { Film } from 'app/models/film.model';
import { ListFilm } from 'app/models/listFilm.models';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  listeRecherche!: Film[];

  listUpdate!: ListFilm;

  userId!: any;

  nameU!: string;

  currentListe!: any;

  films: any[] = [];

  movie: any;

  estConnecte: boolean = false;

  moviesTitles: string[] = [];

  constructor() { }

  connect() {
    this.estConnecte = true;
  }

  disconnect() {
    this.estConnecte = false;
  }

  isConnected() {
    if(this.estConnecte == true) {
      return true;
    } else {
      return false;
    }
  }

  setUserName(name: string) {
    this.nameU = name;
  }

  getUserName() {
    return(this.nameU);
  }

  setCurrentListe(laliste: ListFilm) {
    this.currentListe = laliste;
  }

  getCurrentListe(): ListFilm {
    return this.currentListe;
  }

  getCurrentListeMovies(){
    return this.currentListe.movies;
  }

  getCurrentListeName(){
    return this.currentListe.titrelist;
  }

  setUserId(id: string) {
    this.userId = id;
  }

  getUserId() {
    return this.userId;
  }

  setListOfFilms(films: any) {
    this.films = films;
  }

  getListOfFilms() {
    return this.films;
  }

  setMovie(movie: any) {
    this.movie = movie;
    console.log(this.movie)
  }

  getMovie() {
    return this.movie;
  }

  setListeRecherche(liste: Film[]) {
    this.listeRecherche = liste;
  }

  getListeRecherche() {
    return this.listeRecherche;
  }

  setMoviesTitles(tab: string []){
    this.moviesTitles = tab;
  }

  getMoviesTitles(){
    return this.moviesTitles;
  }

}
