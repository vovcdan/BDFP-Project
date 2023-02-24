import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-affichage-recherche',
  templateUrl: './affichage-recherche.component.html',
  styleUrls: ['./affichage-recherche.component.scss']
})
export class AffichageRechercheComponent implements OnInit {

  searchedMovies: any[] = []

  constructor(private utilService: UtilsService) { }

  ngOnInit() {
    this.getSearchedMovies();

  }

  async getSearchedMovies() {
    this.searchedMovies = await this.utilService.getSearchedMovies();
    console.log(this.searchedMovies)
  }

}