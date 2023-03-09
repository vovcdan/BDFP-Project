import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  @Input() movieData: any;
  constructor(private api: ApiServiceService, private utilService: UtilsService, private router: Router ) { }

  ngOnInit(): void {
    console.log(this.movieData);

  }

  clickFilm() {
    this.utilService.setMovie(this.movieData)
    this.router.navigateByUrl('/home/' + this.movieData.value.title);
  }

}
