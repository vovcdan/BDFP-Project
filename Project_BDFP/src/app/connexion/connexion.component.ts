import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CryptService } from 'services/crypt.service';
import { FilmsService } from 'services/films.service';
import { User } from 'app/models/user.models';
import { TokenService } from 'services/token.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  // message d'erreur si identifiants incorrects
  errorMess: boolean = false;

  // liste de tous les utilisateurs récupérées par l'API mongoDB
  allUsers: User[] = [];

  // formulaire du mot de passe
  passForm = new FormControl();

  // formulaire de l'identifiant (mail)
  idForm = new FormControl();

  constructor(private crypt: CryptService,
              private filmService: FilmsService,
              private router: Router,
              private token: TokenService,
              private utilService: UtilsService,
              ) { }

  ngOnInit(): void {
    if (this.token.isSessionActive()) {
      let sessionObject = JSON.parse(this.token.getSession() || '{}');
      let username = sessionObject.username;
      let userID = sessionObject.userID;
      this.utilService.connect();
      this.utilService.setUserName(username);
      this.utilService.setUserId(userID);7
      this.router.navigateByUrl('home')
    }
  }

  // redirectSign() -> renvoie à la page d'inscription
    redirectSign() {
      this.router.navigateByUrl('signIn');
    }

    /* connexion() -> traite la demande de connexion utilisateur
    * currMdp -> stocke le mot de passe utilisateur crypté
    * getUsers() ->> fonction récupérant les utilisateurs actuels
    * forloop -> boucle sur les utilisateurs actuels pour savoir si les identifiants sont corrects
    * Si ok -> connecte l'utilisateur -> enregistre sont mail -> renvoie l'utilisateur au home
    * Sinon affiche un message d'erreur et efface les formulaires
    */
    connexion() {
      this.errorMess = false;
      let currMdp = this.crypt.cryptMD5(this.passForm.value);
     this.filmService.getUsers().subscribe((allUser) =>{
      this.allUsers = allUser;

      for(let i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].email == this.idForm.value && currMdp == this.allUsers[i].mdp) {
          this.utilService.connect();
          this.utilService.setUserName(this.allUsers[i].email);
          this.utilService.setUserId(this.allUsers[i]._id);
          this.token.login();
          this.router.navigateByUrl('home');
          break;
        }
      }

      this.idForm.setValue(null);
      this.passForm.setValue(null);
      this.errorMess = true;
      });


    }

}


