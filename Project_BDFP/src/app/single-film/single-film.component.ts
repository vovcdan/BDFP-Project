import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Film } from 'app/models/film.model';
import { SuppDialogComponent, SuppDialogModel } from 'app/supp-dialog/supp-dialog.component';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { UtilsService } from 'services/utils.service';
import { HttpClient } from '@angular/common/http';
import wtf from 'wtf_wikipedia';


@Component({
  selector: 'app-single-film',
  templateUrl: './single-film.component.html',
  styleUrls: ['./single-film.component.scss']
})
export class SingleFilmComponent implements OnInit {

  currentFilm: any;

  poster!: string;

  currentFilmInfos: any;

  actors: Map<string, string> = new Map();

  review !: any;

  listeRevue !: any;

  result: any;

  updating = false

  isListShared!: boolean

  formUpdateMovie!: FormGroup

  test: boolean = false;

  constructor(private filmService: FilmsService, private loc: Location, private utilService: UtilsService, private snack: MatSnackBar, private api: ApiServiceService, public dialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    this.init();

    this.formUpdateMovie = new FormGroup({
      noteControl: new FormControl(),
      cinemaControl: new FormControl(),
      dateVisionControl: new FormControl(),
      accompagnateursControl: new FormControl(),
      avisControl: new FormControl(),
    });

    // this.getRealisateur();
    this.chercherActeurs();
    this.getReviews();
  }

  async init() {
    this.currentFilm = this.utilService.getMovie();

    let user_id = this.utilService.getUserId();
    const movie_imdb_id = this.currentFilm.key;

    this.isListShared = this.utilService.getIsListShared();

    if (this.isListShared) {
      this.currentFilmInfos = await this.filmService.getMovieFromOneList(movie_imdb_id);
    } else {
      let movieFromDB_data = await this.filmService.getFilmByOmdbIDAsync(user_id, movie_imdb_id);
      this.currentFilmInfos = await movieFromDB_data!.json();
    }

    let movieFromOMDB_data = await this.api.getMovieByIdAsync(movie_imdb_id);
    let movieFromOMDB = await movieFromOMDB_data!.json()

    this.currentFilmInfos['release_date'] = movieFromOMDB.Year
    this.currentFilmInfos['Actors'] = movieFromOMDB.Actors
    this.currentFilmInfos['Runtime'] = movieFromOMDB.Runtime
    this.currentFilmInfos['Genre'] = movieFromOMDB.Genre
    this.currentFilmInfos['Director'] = movieFromOMDB.Director
    this.currentFilmInfos['Plot'] = movieFromOMDB.Plot
  }

  back() {
    this.loc.back();
  }

  openSnackBar(message: string) {
    this.snack.open(message,"", {
      duration: 3000,
    });
  }

  chercherActeurs() {
    //TODO: Verifier que le premier if marche
    if(this.currentFilm.value.tmdbid) {
      this.api.getCastTMDB(this.currentFilm.value.tmdbid).subscribe((actors: any) => {
        actors.cast.forEach((actor: any) => {
          this.actors.set(actor.name, actor.character)
        })
      })
    } else {
      this.api.getMovieTMDBByIMDBID(this.currentFilm.key).subscribe((film: any) => {
        if (film['movie_results'][0]) {
        let id = film['movie_results'][0].id;
        this.api.getMovieTMDbId(id).subscribe((film: any) => {
          this.api.getCastTMDB(film.id).subscribe((actors: any) => {
            actors.cast.forEach((actor: any) => {
              this.actors.set(actor.name, actor.character)
            })
          })
        })}
      })
    }
  }

  getReviews() {
    this.api.getMovieTMDBByIMDBID(this.currentFilm.key).subscribe((film: any) => {
      if (film['movie_results'][0]) {
      let id = film['movie_results'][0].id;
      this.api.getMovieTMDbId(id).subscribe((film: any) => {
        this.api.getReviewsTMDB(film.id).subscribe((reviews: any) => {
          this.listeRevue = reviews
          reviews.results.forEach((review: any) => {
            this.review = review
          })
        })
      })}
    })
  }

  suppDialog(): void {
    this.utilService.setMovie(this.currentFilm);
    const message = `Êtes-vous sûr de vouloir supprimer ce film ?`;
    const dialogData = new SuppDialogModel("Suppression", message);
    this.utilService.setListeOuGlobalSupp(2)
    const dialogRef = this.dialog.open(SuppDialogComponent, {
      maxWidth: "600px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }

  showFormUpdateNovie() {
    this.updating = !this.updating

    this.formUpdateMovie.patchValue({
      noteControl: this.currentFilmInfos.note,
      cinemaControl: this.currentFilmInfos.cinema,
      dateVisionControl: this.currentFilmInfos.dateVision,
      accompagnateursControl: this.currentFilmInfos.accompagnateurs,
      avisControl: this.currentFilmInfos.avis,
    })
  }


  modifyMovie(){
    let filmModifie: Film = this.currentFilmInfos;
    filmModifie.note = this.formUpdateMovie.get('noteControl')!.value
    filmModifie.cinema = this.formUpdateMovie.get('cinemaControl')!.value
    filmModifie.dateVision = this.formUpdateMovie.get('dateVisionControl')!.value
    filmModifie.accompagnateurs = this.formUpdateMovie.get('accompagnateursControl')!.value
    filmModifie.avis = this.formUpdateMovie.get('avisControl')!.value
    this.filmService.updateMovieInfo(filmModifie)
    this.updating = !this.updating
  }

  async translateTitle(title: string) {
    let doc = await wtf.fetch(title, {lang: 'fr'});
    let text = (doc as any).title()
    return text;
  }


  async scrapeCritiques(titreFilm: string) {
    if (this.test) {
      return;
    }
    this.test=true;

    const str = titreFilm.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();

    console.log("https://www.critikat.com/actualite-cine/critique/"+str);

    //PROXY 1

    // Utilisation d'un proxy pour éviter les problèmes de CORS.
    const url = `https://www.critikat.com/actualite-cine/critique/${str}`
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
    const htmlString = await response.text();

    // Parsage de la chaîne HTML en objet DOM.
    const parser = new DOMParser();
    const htmlDOM = parser.parseFromString(htmlString, 'text/html');


    // Extraction de la critique du film " " de l'objet DOM.
    // On sélectionne tous les éléments HTML qui ont la classe 'review-content'
    // On parcourt la liste d'éléments et on extrait le texte du premier élément qui contient le titre du film recherché
    const critiques = htmlDOM.querySelectorAll('.labeur');
    let critique: string | undefined;

    if(critiques.length > 0) {
      critique = critiques[0].textContent?.trim();
    } else {
      critique = "Aucune critiques disponibles pour ce film"
    }

    console.log('Critique :', critique);
  }


}
