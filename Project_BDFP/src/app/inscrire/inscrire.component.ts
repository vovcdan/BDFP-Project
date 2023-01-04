import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CryptService } from 'services/crypt.service';
import { FilmsService } from 'services/films.service';
import { User } from 'app/models/user.models';
import { async } from 'rxjs';

@Component({
  selector: 'app-inscrire',
  templateUrl: './inscrire.component.html',
  styleUrls: ['./inscrire.component.scss']
})
export class InscrireComponent implements OnInit {

  // erreur sur le nom ou mdp
  errorExist: boolean = false;

  // contient tous les users
  allUsers!: User[];
  
  // formulaire du mot de passe et mail
  passForm = new FormControl();
  idForm = new FormControl();
  

  constructor(private crypt: CryptService,
              private filmService: FilmsService,
              private router: Router) { }

  ngOnInit() {
  }

  /*
  * addUser() -> ajoute un utilisateur dans la base de données mongoDB via l'API express 
  * getUsers() -> récupère les users pour vérifier si l'utilisateur existe déjà
  * Si utilisateur existe déjà -> affiche message d'erreur
  * Sinon -> crypte le mot de passe -> ajoute l'utilisateur à la base de données -> connecte l'utilisateur -> enregistre son mail -> redirige vers home
  */
  addUser() {
    this.filmService.getUsers().subscribe((allUser) => {
      this.allUsers = allUser;
      for(let i = 0; i < this.allUsers.length; i++) {
        if(this.allUsers[i].email == this.idForm.value) {
          this.idForm.setValue(null);
          this.passForm.setValue(null);
          this.errorExist = true;
          return;
        } 
      }
      let currMdp = this.crypt.cryptMD5(this.passForm.value);
      this.filmService.addUser(this.idForm.value, currMdp);
      this.router.navigateByUrl('connect');
    });
    
  }

  createUserList() {
    
}
}
