import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'services/api-service.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movieData: any;
  constructor(private api: ApiServiceService, private utilService: UtilsService, private router: Router ) { }

  clickFilm() {
    this.utilService.setMovie(this.movieData)
    const encodedTitle = encodeURIComponent(this.movieData.value.title);
    this.router.navigateByUrl('/home/' + encodedTitle);
  }

}
