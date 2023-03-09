import { Location } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Film } from 'app/models/film.model';
import { SuppDialogComponent, SuppDialogModel } from 'app/supp-dialog/supp-dialog.component';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-single-film',
  templateUrl: './single-film.component.html',
  styleUrls: ['./single-film.component.scss']
})
export class SingleFilmComponent implements OnInit {

  currentFilm: any;

  poster!: string;

  listfilm: Film[] = [];

  currentFilmInfos: any;

  actors: Map<string, string> = new Map();

  realisator!: string;

  moviesTitles: string[] = [];

  review !: any;

  listeRevue !: any;

  result: any;

  updating = false

  formUpdateMovie!: FormGroup

  previousUrl: string | undefined

  constructor(private filmService: FilmsService, private loc: Location, private utilService: UtilsService, private snack: MatSnackBar, private api: ApiServiceService, public dialog: MatDialog, private router: Router) {
    const currentUrl = this.router.url;
    const previousRoute = this.router.config.find((route) => {
      return route.path && route.path !== '**' && route.path !== '' && currentUrl.includes(route.path);
    });
    console.log(previousRoute);

    //const previousUrl = previousRoute?.data?.previousUrl;
    this.previousUrl = previousRoute?.path
    console.log(this.previousUrl)
    console.log(currentUrl);
   }

  ngOnInit(): void {
    this.currentFilm = this.utilService.getMovie();
    console.log(this.currentFilm);

    this.poster = this.currentFilm.values().next().value;
    console.log(this.poster);

    console.log(this.previousUrl);




    this.currentFilm = this.currentFilm.keys().next().value;
    this.filmService.getFilmsByUid(this.utilService.getUserId()).subscribe((listeFilm) => {
      console.log(listeFilm);
      this.listfilm = listeFilm[0].movies;
      for(let i = 0; i < this.listfilm.length; i++) {
        if(this.listfilm[i].omdbID == this.currentFilm.imdbID) {
          this.currentFilmInfos = this.listfilm[i];
          console.log(this.currentFilmInfos);
          return;
        }
      }
    });

    this.formUpdateMovie = new FormGroup({
      noteControl: new FormControl(),
      cinemaControl: new FormControl(),
      dateVisionControl: new FormControl(),
      accompagnateursControl: new FormControl(),
      avisControl: new FormControl(),
    });
    this.getRealisateur();
    this.chercherActeurs();
    this.getReviews();
    console.log(this.currentFilm);


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
    if(this.currentFilm.tmdbID) {
      this.api.getCastTMDB(this.currentFilm.tmdbID).subscribe((actors: any) => {
        actors.cast.forEach((actor: any) => {
          this.actors.set(actor.name, actor.character)
        })
      })
    } else {
      this.api.getMovieTMDBByIMDBID(this.currentFilm.imdbID).subscribe((film: any) => {
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
    this.api.getMovieTMDBByIMDBID(this.currentFilm.imdbID).subscribe((film: any) => {
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

  getRealisateur() {
    this.api.getMovieTMDBByIMDBID(this.currentFilm.imdbID).subscribe((film: any) => {
      if(film['movie_results'].length != 0 && film['movie_results'][0]) {
        let id = film['movie_results'][0].id;
        this.api.getMovieTMDbId(id).subscribe((film: any) => {
          this.api.getCreditsTMDB(film.id).subscribe((credits: any) => {
            credits.crew.forEach((crew: any) => {
              if(crew.job == "Director") {
                this.realisator = crew.name;
              }
            })
          })
        })
      }
    })
  }

  suppDialog(omdbID: string): void {
    this.utilService.setMovie(this.currentFilm);
    console.log(this.currentFilm)
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
}
