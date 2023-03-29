import { Location } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Film } from 'app/models/film.model';
import { SuppDialogComponent, SuppDialogModel } from 'app/supp-dialog/supp-dialog.component';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { UtilsService } from 'services/utils.service';
import { HttpClient } from '@angular/common/http';
import wtf from 'wtf_wikipedia';
import { Router } from '@angular/router';


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

  isListCommon!: boolean

  formUpdateMovie!: FormGroup

  test: boolean = false

  critique?: string

  lienCritique?: string

  titreCritique?: string;
  auteurCritique?: string;

  spinner: boolean = false

  titreFR: any;

  cinemaFieldHistory!: [string];
  accompagnateursFieldHistory!: [string];

  constructor(private filmService: FilmsService, private loc: Location, private utilService: UtilsService, private snack: MatSnackBar, private api: ApiServiceService, public dialog: MatDialog, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.init();

    this.formUpdateMovie = new FormGroup({
      noteControl: new FormControl('', Validators.pattern('^[0-5]$')),
      cinemaControl: new FormControl(),
      dateVisionControl: new FormControl('', Validators.pattern('^19[0-9]{2}|2[0-9]{3}$')),
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

    this.isListCommon = this.utilService.getIsListCommon();

    if (this.isListShared) {
      this.currentFilmInfos = await this.filmService.getMovieFromOneList(movie_imdb_id);
    } else if(this.isListCommon){
      this.currentFilmInfos = await this.filmService.getMovieFromOneCommonList(this.utilService.getListName(), movie_imdb_id)
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

    this.scrapeCritiques(this.currentFilm.value.title, this.currentFilm.value.tmdbid)
  }

  back() {
    this.router.navigateByUrl("home")
  }

  get spinnerStyle() { return { color: 'Orange' } }

  openSnackBar(message: string) {
    this.snack.open(message, "", {
      duration: 3000,
    });
  }

  chercherActeurs() {
    //TODO: Verifier que le premier if marche
    if (this.currentFilm.value.tmdbid) {
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
          })
        }
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
        })
      }
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

  async getCinemaHistory() {
    let cinemaHistory = await this.filmService.getCinemaHistory();
    return cinemaHistory;
  }

  async getAccompagnateursHistory() {
    let accompagnateursHistory = await this.filmService.getAccompagnateursHistory();
    return accompagnateursHistory;
  }

  async deleteCinemaHistory(event: MouseEvent, cinema: string) {
    event.stopPropagation();
    let cinemaField = await this.filmService.deleteCinemaHistory(cinema);
    this.cinemaFieldHistory = cinemaField;
  }

  async deleteAccompagnateurHistory(event: MouseEvent, accompagnateur: string) {
    event.stopPropagation();
    let accompagnateursHistory = await this.filmService.deleteAccompagnateursHistory(accompagnateur);
    this.accompagnateursFieldHistory = accompagnateursHistory;
  }

  async showFormUpdateNovie() {
    this.updating = !this.updating

    if (this.updating) {
      this.accompagnateursFieldHistory = await this.getAccompagnateursHistory();
      this.cinemaFieldHistory = await this.getCinemaHistory();
    }

    this.formUpdateMovie.patchValue({
      noteControl: this.currentFilmInfos.note,
      cinemaControl: this.currentFilmInfos.cinema,
      dateVisionControl: this.currentFilmInfos.dateVision,
      accompagnateursControl: this.currentFilmInfos.accompagnateurs,
      avisControl: this.currentFilmInfos.avis,
    })
  }


  modifyMovie() {
    let filmModifie: Film = this.currentFilmInfos;
    filmModifie.note = this.formUpdateMovie.get('noteControl')!.value
    filmModifie.cinema = this.formUpdateMovie.get('cinemaControl')!.value
    filmModifie.dateVision = this.formUpdateMovie.get('dateVisionControl')!.value
    filmModifie.accompagnateurs = this.formUpdateMovie.get('accompagnateursControl')!.value
    filmModifie.avis = this.formUpdateMovie.get('avisControl')!.value
    this.filmService.updateMovieInfo(filmModifie)

    if (filmModifie.accompagnateurs != null && filmModifie.accompagnateurs != undefined && filmModifie.accompagnateurs != '') {
      this.filmService.addAccompagnateursHistory(filmModifie.accompagnateurs);
    }

    if (filmModifie.cinema != null && filmModifie.cinema != undefined && filmModifie.cinema != '') {
      this.filmService.addCinemaHistory(filmModifie.cinema);
    }
    this.updating = !this.updating
  }

  // async translateTitle(title: string) {
  //   try {
  //     let doc = await wtf.fetch(title, { lang: 'fr' });
  //     let text = (doc as any).title()
  //     return text;
  //   } catch (error) {
  //     throw new Error("Tranduction du titre du film impossible");
  //   }
  // }

  async getMovieTranslations(movieId: any) {
    try {
      let translations = await this.api.getMovieTranslations(movieId);
      const titleFrench = translations['translations'].find((translation: { [x: string]: string; }) =>
      translation['iso_3166_1'] === 'FR' && translation['iso_639_1'] === 'fr')?.data?.title || '';
      return titleFrench;
    } catch (error) {
      console.error(error);
    }
  }

  async scrapeCritiques(titreFilm: string, tmdbid: string) {
    this.spinner = true
    if (this.test) {
      return;
    }
    this.test = true;

    try {

      try{
        this.titreFR = await this.getMovieTranslations(tmdbid);
        if(this.titreFR === ''){
          this.titreFR = titreFilm
        }
      }catch(error){
        this.titreFR = titreFilm
      }

      let str = this.titreFR;

      // Remplacer les apostrophes par des tirets
      str = str.replace(/'/g, '-');

      // Enlever la chaîne " (film)" s'il existe
      str = str.replace(/ \(film\)/gi, '');

      // Enlever les caractères spéciaux (sauf les tirets, les underscores et les espaces)
      str = str.replace(/[^a-zA-Z0-9\s-_àáâäçèéêëîïôöùûüÀÁÂÄÇÈÉÊËÎÏÔÖÙÛÜ]/g, '');

      // Remplacer les espaces et les underscores par des tirets
      str = str.replace(/[\s_]+/g, '-');

      // Mettre en minuscules
      str = str.toLowerCase();

      // Enlever les accents (sauf ceux sur les lettres "àáâäçèéêëîïôöùûü")
      str = str.normalize("NFD").replace(/[\u0300-\u0302\u0307\u0308\u0327]/g, "");

      // Supprimer le tiret en fin de chaîne, s'il y en a un
      if (str.charAt(str.length - 1) === '-') {
        str = str.slice(0, -1);
      }

      this.lienCritique = "https://www.critikat.com/actualite-cine/critique/" + str

      //PROXY 1

      // Utilisation d'un proxy pour éviter les problèmes de CORS.
      const url = `https://www.critikat.com/actualite-cine/critique/${str}`
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      const htmlString = await response.text();

      // Parsage de la chaîne HTML en objet DOM.
      const parser = new DOMParser();
      const htmlDOM = parser.parseFromString(htmlString, 'text/html');

    // Extraction du titre et de l'auteur de la critique
    // On sélectionne le premier élément HTML qui a la classe ici c'est Cherchez le beauf
    const titleElement = htmlDOM.querySelector('title');
    const authorElement = htmlDOM.querySelector('span[itemprop="author"] a');
    this.titreCritique = titleElement?.textContent?.trim() || '';
    this.auteurCritique = authorElement?.textContent?.trim() || '';

      // Extraction de la critique du film " " de l'objet DOM.
      // On sélectionne tous les éléments HTML qui ont la classe 'review-content'
      // On parcourt la liste d'éléments et on extrait le texte du premier élément qui contient le titre du film recherché
      const critiques = htmlDOM.querySelectorAll('.labeur');

      if (critiques.length > 0) {
        let critique!: string | undefined
        critique = critiques[0].textContent?.trim();
        const regex = /jQuery\(.*}\);./gi;
        const newStr = critique!.replace(regex, "");
        if (newStr.includes("function")) {
          const index = newStr.indexOf('function');
          const newStr2 = newStr.substring(0, index);
          this.critique = newStr2
        } else {
          this.critique = newStr
        }

      } else {
        this.critique = "Aucune critiques disponibles pour ce film"
      }
      this.spinner = false
    } catch (error) {
      throw new Error("Récuperation des revues échouée")
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(CritiqueDialogComponent, {
      data: {
        critique: this.critique!,
        lienCritique: this.lienCritique!,
        titreCritique: this.titreCritique!,
        spinner: this.spinner,
        auteurCritique: this.auteurCritique!
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'app-critique-dialog',
  templateUrl: './critique-dialog.html',
  styleUrls: ['./critique-dialog.scss']
})
export class CritiqueDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
