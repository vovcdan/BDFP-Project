import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ListFilm } from 'app/models/listFilm.models';
import { ExportService } from 'services/export.service';
import { FilmsService } from 'services/films.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-liste-comp',
  templateUrl: './liste-comp.component.html',
  styleUrls: ['./liste-comp.component.scss'],
})
export class ListeCompComponent implements OnInit {
  listofFilms: ListFilm[] = [];
  commonList: any[] = []
  arraysOfLists: any[] = [];
  listVide!: ListFilm;
  searchText!: any;
  aucuneListe:boolean = false

  constructor(
    private filmsService: FilmsService,
    private router: Router,
    private utilService: UtilsService
  ) {}

  ngOnInit(): void {
    this.filmsService
      .getAllListFromUser(this.utilService.getUserId())
      .subscribe((listofFilms) => {
        this.listofFilms = listofFilms;
        if (this.listofFilms.length == 0){
          this.aucuneListe = true
        }
      });

    this.getCommonList()
  }

  async getCommonList(){
    this.commonList = await this.filmsService.getAllCommonListOfUser()
  }

  gererListe(laliste: any) {
    this.router.navigateByUrl('/favs/' + laliste.titrelist);
    this.utilService.setListName(laliste.titrelist);
    this.utilService.setCurrentListe(laliste);
    if(laliste.shared != undefined){
      this.utilService.setisListShared(laliste.shared);
      this.utilService.setIsListCommon(false)
    } else if (laliste.common != undefined){
      this.utilService.setisListShared(false)
      this.utilService.setIsListCommon(laliste.common)
    }

  }

  async addSharedListToUserLists(list: ListFilm) {
    let title = list.titrelist;
    const index = title.indexOf('partagee');
    let list_title = title.substring(0, index);
    list_title = list_title.slice(0, -1);
    await this.filmsService.addListToAllListsAsync(list_title);
    for (let i = 0; i < list.movies.length; i++) {
      await this.filmsService.addFilmToAllListsAsync(
        list_title,
        list.movies[i].titre,
        list.movies[i].omdbID,
        list.movies[i].dateVision,
        list.movies[i].cinema,
        list.movies[i].accompagnateurs,
        list.movies[i].avis,
        list.movies[i].note
      );
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/favs');
    });

    //await this.filmsService.addFilmToAllListsAsync(list_title, list.movies[0].titre, list.movies[0].omdbID, list.movies[0].dateVision, list.movies[0].cinema, list.movies[0].accompagnateurs, list.movies[0].avis, list.movies[0].note)

    // list.movies.forEach(movie => {
    //   this.filmsService.addFilmToAllListsAsync(list_title, movie.titre, movie.omdbID, movie.dateVision, movie.cinema, movie.accompagnateurs, movie.avis, movie.note)
    // });
  }
}
