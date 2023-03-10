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

  imdbIdAndMovieTitle: string[] = [];

  listeOuGlobalSupp!: number;

  moviesTitles: string[] = [];

  searchedMovies: any[] = []

  listName!: string

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

  getListOfFilms() { //renvoie la liste de films d'un utilisateur
    return this.films;
  }

  setMovie(movie: any) {
    this.movie = movie;
  }

  getMovie() {
    return this.movie;
  }

  setImdbIdAndMovieTitle(tab: string[]){
    this.imdbIdAndMovieTitle = tab;
  }

  getImdbIdAndMovieTitle(){
    return this.imdbIdAndMovieTitle;
  }

  setListeOuGlobalSupp(val: number){
    this.listeOuGlobalSupp = val;
  }

  getListeOuGlobalSupp() {
    return this.listeOuGlobalSupp;
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

  setListName(listName: string) {
    this.listName = listName
  }

  getListName(){
    return this.listName
  }

  setSearchedMovies(searchedMovies: any){
    this.searchedMovies = []
    this.searchedMovies = searchedMovies;
  }

  async getSearchedMovies(){
    return this.searchedMovies;
  }

  // getResultatRecherche() {
  //   return this.showResultatRecherche
  // }

  // setResultatRecherche(res: boolean){
  //   this.showResultatRecherche = res;
    
  // }

}
