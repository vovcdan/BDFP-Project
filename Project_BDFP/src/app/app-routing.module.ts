import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConnexionComponent } from './connexion/connexion.component';
import { ajouterFilm, HomeComponent } from './home/home.component';
import { ListesComponent } from './listes/listes.component';
import { SingleFilmComponent } from './single-film/single-film.component';
import { SingleListeComponent } from './single-liste/single-liste.component';

const routes: Routes = [
  {path: 'connect', component: ConnexionComponent},
  {path: 'favs', component: ListesComponent ,canActivate: [AuthService] },
  {path: 'home', component: HomeComponent, canActivate: [AuthService] },
  {path: 'home/ajouterFilm', component: ajouterFilm, canActivate: [AuthService]},
  {path: 'favs/:titre', component: SingleListeComponent, canActivate: [AuthService] },
  {path: 'home/:titrefilm', component: SingleFilmComponent, canActivate: [AuthService] },
  {path: '', component: ConnexionComponent , canActivate: [AuthService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
