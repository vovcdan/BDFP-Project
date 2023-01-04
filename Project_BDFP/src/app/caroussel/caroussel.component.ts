import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiServiceService } from 'services/api-service.service';
import { Observable, debounceTime, distinctUntilChanged, switchMap, map, Subscriber } from 'rxjs';
import { interval } from 'rxjs';
@Component({
  selector: 'app-caroussel',
  templateUrl: './caroussel.component.html',
  styleUrls: ['./caroussel.component.scss']
})

export class CarousselComponent implements OnInit {

  // variable contenant tous les films
  allFilms: any;

  // subscriber chaque seconde
  data$ = interval(1000);

  // Objet Caroussel
  imageObject: Array<object> = [];

  constructor(private api: ApiServiceService) { }

  ngOnInit(): void {
    this.requestMultiple();
  };


  /*
  * requestMultiple -> récupère les films de l'API OMDB correspondant au nom "titanic" puis les ajoutes au Caroussel du menu
  * imageCaroussel -> variable intermédiaire de stockage des données de chaque film
  * getMovieBySearchTerm() -> fonction du service API (expliqué dans APIService)
  */
  requestMultiple() {
    this.api.getMovieBySearchTerm('titanic').subscribe((value) => {
      this.allFilms = value;
      for (let i = 0; i < this.allFilms.Search.length; i++) {
        let imagesCaroussel = {
          image: this.allFilms.Search[i].Poster,
          thumbImage: this.allFilms.Search[i].Poster,
          title: this.allFilms.Search[i].title,
          order: i
        }
        this.imageObject.push(imagesCaroussel);
      };
    });
  };
}
