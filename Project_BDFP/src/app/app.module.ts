import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { HomeComponent  } from './home/home.component';
import { CarousselComponent } from './caroussel/caroussel.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { InscrireComponent } from './inscrire/inscrire.component';
import { DialogOverviewExampleDialog, ListesComponent } from './listes/listes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { ListeCompComponent } from './lis/liste-comp.component';
import {MatIconModule} from '@angular/material/icon';
import { SingleListeComponent, ajouterUnFilm, partagerListe } from './single-liste/single-liste.component';
import { AuthService } from 'services/auth.service';
import {MatSelectModule} from '@angular/material/select';
import { AffichageFilmsComponent } from './affichage-films/affichage-films.component';
import { SingleFilmComponent } from './single-film/single-film.component';
import { DetailListeComponent } from './detail-liste/detail-liste.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';
import { ajouterFilm } from './home/home.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SuppDialogComponent } from './supp-dialog/supp-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ConnexionComponent,
    HomeComponent,
    CarousselComponent,
    InscrireComponent,
    ListesComponent,
    DialogOverviewExampleDialog,
    ListeCompComponent,
    SingleListeComponent,
    ajouterFilm,
    ajouterUnFilm,
    partagerListe,
    AffichageFilmsComponent,
    SingleFilmComponent,
    DetailListeComponent,
    SuppDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgImageSliderModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatRadioModule,
    Ng2SearchPipeModule,
    MatTooltipModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
  entryComponents: [ajouterFilm, SuppDialogComponent],
  
})
export class AppModule { }
