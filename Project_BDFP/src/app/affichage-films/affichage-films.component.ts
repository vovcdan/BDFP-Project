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
  styleUrls: ['./affichage-films.component.scss']
})
export class AffichageFilmsComponent implements OnInit {

  films: Film[] = [];

  filmsWithAPI: any[] = [];

  showFormRecherche: boolean = false;
  formRecherche!: FormGroup;
  titreControl = new FormControl();
  realisatorControl = new FormControl();
  yearControl = new FormControl();
  actorsControl = new FormControl();
  locationControl = new FormControl();
  accompagnateursControl = new FormControl();
  resList: any[] = [];

  constructor(private filmService: FilmsService, private api: ApiServiceService, private router: Router, private utilService: UtilsService, private rechercheService: RechercheService) { }

  ngOnInit(): void {
    this.films = this.utilService.getListeRecherche();
    if(this.films) {
      for(let i = 0; i < this.films.length; i++) {
        this.api.getMovieById(this.films[i].omdbID).subscribe((filmAPI) => {
          this.filmsWithAPI[i] = filmAPI;
        })
      }

    } else {
      this.filmService.getFilmsByUid(this.utilService.getUserId()).subscribe((allfilms) => {
        this.films = allfilms[0].movies;
        this.utilService.setListOfFilms(this.films);
        if(this.films.length >= 14) {
          for(let i = 0; i < 14; i++) {
            this.api.getMovieById(this.films[i].omdbID).subscribe((filmAPI) => {
                this.filmsWithAPI[i] = filmAPI;
              })
            }
        } else {
          for(let i = 0; i < this.films.length; i++) {
            this.api.getMovieById(this.films[i].omdbID).subscribe((filmAPI) => {
              this.filmsWithAPI[i] = filmAPI;
            })
          }
        }
      });
    }
    
  }

  reloadFilms() {
    this.filmService.getFilmsByUid(this.utilService.getUserId()).subscribe((allfilms) => {
      this.films = allfilms[0].movies;
      this.utilService.setListOfFilms(this.films);      
              this.utilService.setListeRecherche(this.films);
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigateByUrl('/home');
              });
      })
    
  }

  clickFilm(infoFilm: any) {
    console.log("Affichage films " + infoFilm.Title);
    this.utilService.setMovie(infoFilm);
    if(infoFilm.Title != undefined){
      this.router.navigateByUrl('/home/' + infoFilm.Title);
    } else {
      this.router.navigateByUrl('/home/' + infoFilm.original_title);
    }
  }

  affichageForm() {
    this.showFormRecherche = !this.showFormRecherche;
  }

  rechercherFilm() {
    this.resList = [];
    if(this.titreControl.value != undefined && this.titreControl.value != ""){
      this.getFilmsByTitre(this.titreControl.value, this.resList);
    }
    if(this.realisatorControl.value != undefined && this.realisatorControl.value != ""){
      this.getFilmsByRealisator(this.realisatorControl.value, this.resList);
    }
    if(this.yearControl.value != undefined && this.yearControl.value != ""){
      this.getFilmsByYear(this.yearControl.value, this.resList);
    }
    if(this.actorsControl.value != undefined && this.actorsControl.value != ""){
      this.getFilmsByActors(this.actorsControl.value, this.resList);
    }
    if(this.locationControl.value != undefined && this.locationControl.value != ""){
      this.getFilmsByLocation(this.locationControl.value, this.resList);
    }
    if(this.accompagnateursControl.value != undefined && this.accompagnateursControl.value != ""){
      this.getFilmsByAccompagnateurs(this.accompagnateursControl.value, this.resList);
    }

      this.utilService.setListeRecherche(this.resList);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl('/home');
      });
      
  }



  // parti du formulaire de recherche

  getFilmsByTitre(titre: string, tab: any[]){
    this.resList = this.rechercheService.getFilmsByTitre(titre, tab);
  }

  getFilmsByRealisator(real: string, tab: any[]){
    this.resList = this.rechercheService.getFilmsByRealisator(real, tab);
  }

  getFilmsByYear(year: string, tab: any[]) {
    this.resList = this.rechercheService.getFilmsByYear(year, tab);
  }

  getFilmsByActors(actors: string, tab: any[]) {
    this.resList = this.rechercheService.getFilmsByActor(actors, tab);
  }

  getFilmsByLocation(loc: string, tab: any[]) {
    this.resList = this.rechercheService.getFilmsByLocation(loc, tab);
  }

  getFilmsByAccompagnateurs(acc: string, tab: any[]) {
    this.resList = this.rechercheService.getFilmsByAccompagnateurs(acc, tab);
  }
}
