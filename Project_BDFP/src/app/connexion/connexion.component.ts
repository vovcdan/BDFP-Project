import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CryptService } from 'services/crypt.service';
import { FilmsService } from 'services/films.service';
import { User } from 'app/models/user.models';
import { TokenService } from 'services/token.service';
import { UtilsService } from 'services/utils.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss'],
})
export class ConnexionComponent implements OnInit {
  // message d'erreur si identifiants incorrects
  errorMess!: string;

  // liste de tous les utilisateurs récupérées par l'API mongoDB
  allUsers: User[] = [];

  // formulaire du mot de passe
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  confirmPassword = new FormControl('', [Validators.required]);

  // formulaire de l'identifiant (mail)
  email = new FormControl('', [Validators.required, Validators.minLength(3)]);

  signUp: boolean = false;

  hide = true;

  constructor(
    private crypt: CryptService,
    private filmService: FilmsService,
    private router: Router,
    private token: TokenService,
    private utilService: UtilsService
  ) {}

  ngOnInit(): void {
    if (this.token.isSessionActive()) {
      let sessionObject = JSON.parse(this.token.getSession() || '{}');
      let username = sessionObject.username;
      let userID = sessionObject.userID;
      this.utilService.connect();
      this.utilService.setUserName(username);
      this.utilService.setUserId(userID);
      7;
      this.router.navigateByUrl('home');
    }
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Entrez votre pseudo';
    }
    return this.email.hasError('minlength') ? '3 caractères minimum' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Entrez votre mot de passe';
    }

    return this.password.hasError('minlength') ? '3 caractères minimum' : '';
  }

  getConfirmPasswordErrorMessage() {
    let s = '';
    if (this.confirmPassword.hasError('required')) {
      s = 'Confirmez votre mot de passe';
    } else if (this.password.value != this.confirmPassword.value) {
      console.log('gneuh');
      s = 'Les mots de passe diffèrent';
    }

    return s;
  }

  setSignUp() {
    this.signUp = !this.signUp;
    this.email.setErrors(null);
    this.password.setErrors(null);
    this.confirmPassword.setErrors(null);
  }

  addUserOrConnect() {
    if (this.signUp) {
      this.addUser();
    } else {
      this.connexion();
    }
  }

  /* connexion() -> traite la demande de connexion utilisateur
   * currMdp -> stocke le mot de passe utilisateur crypté
   * getUsers() ->> fonction récupérant les utilisateurs actuels
   * forloop -> boucle sur les utilisateurs actuels pour savoir si les identifiants sont corrects
   * Si ok -> connecte l'utilisateur -> enregistre sont mail -> renvoie l'utilisateur au home
   * Sinon affiche un message d'erreur et efface les formulaires
   */
  async connexion() {
    if (this.email.value!.length >= 3 && this.password.value!.length >= 3) {
      let password_encrypted = this.crypt.cryptMD5(this.password.value!);

      let user = await this.filmService.getUserByEmailAndPassword(
        this.email.value!,
        password_encrypted
      );
      if (user[0] != undefined) {
        this.utilService.connect();
        this.utilService.setUserName(user[0].email);
        this.utilService.setUserId(user[0]._id);
        this.token.login();
        this.router.navigateByUrl('home');
      } else {
        this.errorMess = 'Identifiants incorrects';
      }
    } else {
      this.errorMess = 'Le mail et de mot de passe sont obligatoires';
    }
  }

  async addUser() {
    if (this.email.value!.length >= 3 && this.password.value!.length >= 3) {
      if (this.password.value! == this.confirmPassword.value!) {
        let password_encrypted = this.crypt.cryptMD5(this.password.value!);

        let user = await this.filmService.getUserByMailAsync(this.email.value!);
        if (user[0] == undefined) {
          await this.filmService.addUserAsync(this.email.value!, password_encrypted);
          await this.connexion()
          // this.router.navigateByUrl('home');
        } else {
          this.errorMess = `Le pseudo ${this.email.value!} existe déjà`;
        }
      } else {
        this.errorMess = "Les deux mots de passes diffèrent"
      }
    } else {
      this.errorMess = 'Tous les champs doivent être remplis';
    }
  }
}
