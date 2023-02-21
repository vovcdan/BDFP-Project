import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ListFilm } from 'app/models/listFilm.models';
import { ExportService } from 'services/export.service';
import { FilmsService } from 'services/films.service';
import { UtilsService } from 'services/utils.service';


@Component({
  selector: 'app-liste-comp',
  templateUrl: './liste-comp.component.html',
  styleUrls: ['./liste-comp.component.scss']
})
export class ListeCompComponent implements OnInit {

  listofFilms: ListFilm[] = [];
  arraysOfLists: any[] = [];
  listVide!: ListFilm;
  searchText!: any;

  constructor(private filmsService: FilmsService,
              private router: Router, private utilService: UtilsService, private exportService: ExportService) { }

  ngOnInit(): void {
    this.filmsService.getAllListFromUser(this.utilService.getUserId()).subscribe((listofFilms) => {
      this.listofFilms = listofFilms;
    });
}

gererListe(laliste: ListFilm){
  this.router.navigateByUrl('/favs/' + laliste.titrelist)
  this.utilService.setCurrentListe(laliste);
}
}

