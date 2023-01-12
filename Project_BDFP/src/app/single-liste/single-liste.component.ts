  import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Film } from 'app/models/film.model';
import { ListFilm } from 'app/models/listFilm.models';
import { FilmsService } from 'services/films.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiServiceService } from 'services/api-service.service';
import { User } from 'app/models/user.models';
import { UtilsService } from 'services/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ExportService} from 'services/export.service';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { SuppDialogComponent, SuppDialogModel } from 'app/supp-dialog/supp-dialog.component';

export interface DialogAjoutFilmListe {
  title: string;
}

export interface dialogShare {
  email: string;
}

@Component({
  selector: 'app-single-liste',
  templateUrl: './single-liste.component.html',
  styleUrls: ['./single-liste.component.scss']
})
export class SingleListeComponent implements OnInit {

  email!: string;

  movies: Film[] = [];

  currentListe!: ListFilm;

  curListExport: any;

  title!: string;

  destUser!: User;
  
  result: any;

  constructor(private filmService: FilmsService, private router: Router, private loc: Location,
    public diag: MatDialog, private utilService: UtilsService, private snack: MatSnackBar
    ,private exportService: ExportService) { }

  ngOnInit(): void {
    this.currentListe = this.utilService.getCurrentListe();
  }

  back() {
    this.loc.back();
  }

  openSnackBar(message: string) {
    this.snack.open(message,"", {
      duration: 3000,
    });
  }

  deleteListe() {
    var inst = this.utilService.getCurrentListe();
    this.filmService.deleteListOfAllLists(inst._id).subscribe(del => {
      this.openSnackBar('Liste ' + inst.titrelist + " a été supprimé")
      this.loc.back();
    })

  }

  reset(liste: ListFilm) {
    liste.titrelist = '';
    liste._id = '';
    liste.movies = [];
    liste.uid = '';
    return liste;
  }


  openDialog(): void {
    const dialogRef = this.diag.open(ajouterUnFilm, {
      width: '250px',
      data: {title: this.title}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.title = result;
    });
  }

  dialogShare(): void {
    const dialogRef = this.diag.open(partagerListe, {
      width: '250px',
      data: {email: this.email}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.email = result;
    });
  }

  export() {
    this.filmService.getOneList(this.utilService.getUserId(), this.utilService.getCurrentListeName()).subscribe(laliste => {
      this.curListExport = laliste;
      this.exportService.exportExcel(this.curListExport[0].movies, this.curListExport[0].titrelist);
    })
  }

  suppDialog(omdbID: string): void {
    this.utilService.setMovie(this.currentListe);
    console.log(this.currentListe)
    const message = `Êtes-vous sûr de vouloir supprimer cette liste ?`;
    const dialogData = new SuppDialogModel("Suppression", message);
    this.utilService.setListeOuGlobalSupp(3)
    const dialogRef = this.diag.open(SuppDialogComponent, {
      maxWidth: "600px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }

}


@Component({
  selector: 'app-single-liste-dialog',
  templateUrl: 'single-liste.component-dialog.html',
})



export class ajouterUnFilm implements OnInit {


  currentListAPI: any;

  films: Film[] = [];

  currentListFilm!: ListFilm[];

  movies: Film[] = [];

  filmChoisi!: Film;

  allMovies: Film[] = [];

  temp: any;

  inter: Film[] = [];

  val: boolean = false;

  titre!: Film["titre"];

  filmControl = new FormControl<string | Film>('');
  optionsMovie: Film[] = [];
  filteredMovies!: Observable<Film[]>;

  curListeRefreshed: any;

  constructor(
    public dialogRef: MatDialogRef<ajouterUnFilm>, private film: FilmsService, private api: ApiServiceService, private utilService: UtilsService, private snack: MatSnackBar, private router: Router,
    @Inject(MAT_DIALOG_DATA) public dataAjout: DialogAjoutFilmListe, private exportService: ExportService) {}


  ngOnInit(): void {
    this.film.getFilmsByUid(this.utilService.getUserId()).subscribe((allFilms) => {
      this.currentListFilm = allFilms;
      for(let i = 0; i < this.currentListFilm.length; i++) {
        this.movies = this.currentListFilm[i].movies;
      }

      for (let i = 0; i < this. movies.length; i++) {
        this.optionsMovie.push(this.movies[i]);
      }
    })

    this.filteredMovies = this.filmControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const titre = typeof value === 'string' ? value : value?.titre;
        return titre ? this._filter(titre as string) : this.optionsMovie.slice();
      }),
    );
  }

  displayFn(film: Film): string {
    return film && film.titre ? film.titre : '';
  }

  private _filter(titre: string): Film[] {
    const filterValue = titre.toLowerCase();

    return this.optionsMovie.filter(option => option.titre.toLowerCase().includes(filterValue));
  }

  onSelected() {
    this.filmChoisi = this.filmChoisi;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snack.open(message,"", {
      duration: 3000,
    });
  }

  ajoutFilm() {

    var imdbID: any;
    if(this.filmChoisi != undefined) {
      imdbID = this.filmChoisi.omdbID;
    } else {
      this.openSnackBar("Veuillez selectionner un film");
    }

      this.film.getOneList(this.utilService.getUserId(), this.utilService.getCurrentListeName()).subscribe(laListe => {
        this.curListeRefreshed = laListe;

        if(!this.checkIfFilmExistsInList(this.filmChoisi.omdbID, this.curListeRefreshed[0]) && imdbID) {
          this.film.addFilmToAllLists(this.curListeRefreshed[0].titrelist, this.filmChoisi.titre, this.filmChoisi.omdbID, this.utilService.getUserId(), this.filmChoisi.dateVision, this.filmChoisi.cinema, this.filmChoisi.accompagnateurs, this.filmChoisi.avis, this.filmChoisi.note).subscribe(thefilm => {
            this.openSnackBar(this.filmChoisi.titre + " a été ajouté à la liste " + this.curListeRefreshed[0].titrelist );
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl('/favs/' + this.curListeRefreshed[0].titrelist);
              this.dialogRef.close();
            })
          });
        } else if (this.checkIfFilmExistsInList(this.filmChoisi.omdbID, this.curListeRefreshed[0])) {
            this.openSnackBar(this.filmChoisi.titre + " appartient déjà à la liste " + this.utilService.getCurrentListeName() );

        } else {
            this.openSnackBar(this.filmChoisi + " n'appartient pas dans votre répertoire");
        }

      })
  }

  checkIfFilmExistsInList(movieID: any, liste: any):boolean {
    if(liste.movies.length == 0) {
      return false;
    }
    for(let i = 0; i < liste.movies.length; i++) {
      if(liste.movies[i].omdbID == movieID) {
        this.val = true;
        break;
      }
    }
    return this.val;
  }



}


@Component({
  selector: 'app-single-liste-dialogShare',
  templateUrl: 'single-liste.component-dialogShare.html',
})



export class partagerListe implements OnInit {

  email!: string;

  usr: any;

  tempe: any;


  constructor(
    public dialogRef: MatDialogRef<partagerListe>, private film: FilmsService, private api: ApiServiceService, private utilService: UtilsService, private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: dialogShare) {}


  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snack.open(message,"", {
      duration: 3000,
    });
  }

  partagerListe() {
    this.film.getUserByMail(this.data.email).subscribe((user) => {
      this.usr = user;
      var inst = this.utilService.getCurrentListe();
      this.film.getOneList(this.utilService.getUserId(), inst.titrelist).subscribe((laliste) => {
        this.tempe = laliste;
        this.utilService.setCurrentListe(this.tempe[0]);
        this.film.shareList(this.usr[0]._id, this.tempe[0].titrelist, this.tempe[0]).subscribe(res => {
        this.openSnackBar("La liste " + inst.titrelist + " a été partagée à " + this.data.email)
      });
    });

  });

  }


}
