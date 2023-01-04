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

  film: any[] = [];

  estConnecte: boolean = false;

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
    this.film = films;
  }

  getListOfFilms() {
    return this.film;
  }

  setListeRecherche(liste: Film[]) {
    this.listeRecherche = liste;
  }

  getListeRecherche() {
    return this.listeRecherche;
  }

}
