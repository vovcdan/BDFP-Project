import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FilmsService } from 'services/films.service';
import { Film } from 'app/models/film.model';
import { ListFilm } from 'app/models/listFilm.models';
import { threadId } from 'worker_threads';
import { UtilsService } from 'services/utils.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  title: string;
}

@Component({
  selector: 'app-listes',
  templateUrl: './listes.component.html',
  styleUrls: ['./listes.component.scss'],
})
export class ListesComponent implements OnInit {
  arraysOfLists: any[] = [];

  title!: string;

  desc!: string;

  listofFilms: ListFilm[] = [];

  constructor(public diag: MatDialog, private filmsService: FilmsService) {}

  ngOnInit(): void {}

  openCreateCommonListDialog(): void {
    const dialogRef = this.diag.open(CreateCommonListDialog, {
      width: '250px',
      data: { title: this.title },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.title = result;
    });
  }

  openDialog(): void {
    const dialogRef = this.diag.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { title: this.title },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.title = result;
    });
  }
}

@Component({
  selector: 'app-listes-dialog',
  templateUrl: 'listes.component-dialog.html',
})
export class DialogOverviewExampleDialog implements OnInit {
  error_message!: string

  testEqual!: ListFilm[];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private filmService: FilmsService,
    private utilService: UtilsService,
    private router: Router,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.filmService
      .getAllListFromUser(this.utilService.getUserId())
      .subscribe((allLists) => {
        this.testEqual = allLists;
      });
    this.data.title = '';
  }

  openSnackBar(message: string) {
    this.snack.open(message, '', {
      duration: 3000,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async ajoutListe() {
    const list = await this.filmService.getOneListAsync(this.data.title);
    if(list != undefined){
      this.error_message = "Une liste existe déjà sous ce nom"
    } else {
      this.filmService
        .addListToAllLists(this.utilService.getUserId(), this.data.title)
        .subscribe((log) => {
          this.openSnackBar('Liste ' + this.data.title + ' à été créée');
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigateByUrl('/favs');
              this.dialogRef.close();
            });
        });
    }
  }
}

@Component({
  selector: 'app-create-common-list',
  templateUrl: './create-common-list-dialog.html',
})
export class CreateCommonListDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private filmService: FilmsService,
    private utilService: UtilsService,
    private router: Router,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snack.open(message, '', {
      duration: 3000,
    });
  }

  createCommonList() {
    this.filmService.createCommonList(this.data.title).then((res) => {
      this.openSnackBar('Liste ' + this.data.title + ' à été créée');
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigateByUrl('/favs');
        this.dialogRef.close();
      });
    });
  }
}
