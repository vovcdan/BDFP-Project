import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Film } from '../app/models/film.model';
import { User } from '../app/models/user.models';
import { ListFilm } from '../app/models/listFilm.models';
import { DemiListFilm } from 'app/models/demiMoviesLists.model';
import { CryptService } from './crypt.service';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { UtilsService } from 'services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class FilmsService {

  userForShare!: User;

  titre!: string;

  id!: any;

  listExport!: ListFilm[];

  moviesTitles: any[] = [];

  errorMessage!: string;

  constructor(private http: HttpClient, private crypt: CryptService, private utilService: UtilsService) {}


  // Initialise la liste pour l'objet Films de l'utilisateur
  // Ne surtout pas utiliser car est appelé dans addUser
  createListFilmForUser(userId: string) {
    this.http.post('http://localhost:8080/api/movies/', {"uid": userId, "movies": []}).subscribe();
  }

  // ajoute un film à la bd privé de l'utilisateur
  addFilmToList(titre: string, omdbID: string, tmdbID: string, userId: string, dateVision: string, cinema: string, accompagnateurs: string, avis: string, note: string): Observable<Film> {
    let lefilm: EventEmitter<Film> = new EventEmitter<Film>();
    return this.http.post<Film>('http://localhost:8080/api/movies/' + userId, {"movies": {"titre": titre, "omdbID": omdbID, "tmdbID": tmdbID, "dateVision": dateVision, "cinema": cinema, "accompagnateurs": accompagnateurs, "avis": avis, "note": note}});
  }

  // ajoute un nouvel utilisateur (inscription)
    addUser(email: string, mdp: string) {

    this.http.post('http://localhost:8080/api/users', {"email":email, "mdp":mdp}).subscribe((res) => {
      this.id = res;
      this.createListFilmForUser(this.id._id);
      return res;
    }, (error) => {
        console.log(error)
      return null;
  });
}

  // créé une liste pour un utilisateur pour ensuite stocker des films à l'intérieur
  addListToAllLists(idUser: string, titrelist: string,) {
    let list: EventEmitter<ListFilm> = new EventEmitter<ListFilm>();
    this.http.post<ListFilm>('http://localhost:8080/api/allLists/', {"uid": idUser, "titrelist": titrelist }).subscribe((log) => {
      list.emit(log);
  }, (error) => {


      console.log(error)
  });
  return list;
  }

  // créé une liste pour un utilisateur pour ensuite stocker des films à l'intérieur
  addFilmToAllLists(titrelist: string, titre: string, omdbID: string, uid: string, dateVision: string, cinema: string, accompagnateurs: string, avis: string, note: string) {
    let film: EventEmitter<any> = new EventEmitter<any>();
    this.http.post<any>('http://localhost:8080/api/allLists/' + uid + '/' + titrelist, {"movies": {"titre": titre, "omdbID": omdbID, "dateVision": dateVision, "cinema": cinema, "accompagnateurs": accompagnateurs, "avis": avis, "note": note}}).subscribe((log) => {
      film.emit(log)
  }, (error) => {
      console.log(error)
  });
  return film;
  }

  deleteAllUsers() {

    this.http.delete('http://localhost:8080/api/users/', {}).subscribe((log) => {

  }, (error) => {
      console.log(error)
  });
  }

  deleteAllLists() {

    this.http.delete('http://localhost:8080/api/allLists/', {}).subscribe((log) => {

  }, (error) => {
      console.log(error)
  });
  }

  deleteMovieDBById(imdbID: string) {
    let response: EventEmitter<any> = new EventEmitter<any>();
    this.http.delete<any>('http://localhost:8080/api/movies/' + this.utilService.getUserId() + '/movie/' + imdbID, {}).subscribe((log) => {
      response.emit(log);
  }, (error) => {
      console.log(error)
  });
  return response;
  }

  deleteMovieFromList(titrelist: string, omdb: string){
    let response: EventEmitter<any> = new EventEmitter<any>();
    this.http.delete<any>('http://localhost:8080/api/allLists/' + this.utilService.getUserId() + '/' + titrelist + '/' + omdb, {}).subscribe((log) => {
    response.emit(log)
    }, (error) => {
      console.log(error)
    })
    return response;
  }

  deleteListOfAllLists(idListe: string) {
    let response: EventEmitter<any> = new EventEmitter<any>();
    this.http.delete<any>('http://localhost:8080/api/allLists/' + idListe, {}).subscribe((log) => {
      response.emit(log)
  }, (error) => {
      console.log(error)
  });
  return response
  }

  deleteAllMovies() {
    this.http.delete('http://localhost:8080/api/movies/', {}).subscribe((log) => {

  }, (error) => {
      console.log(error)
  });
  }

  ModifyUserMail(userId: string, newMail: string) {
    this.http.put('http://localhost:8080/api/users/' + userId, {'email': newMail}).subscribe((log) => {

  }, (error) => {
      console.log(error)
  });
  }

  getFilmsByUid(idUser: string) {
    let film: EventEmitter<any[]> = new EventEmitter<any[]>();

    this.http.get<any[]>('http://localhost:8080/api/movies/' + idUser).subscribe(
      (listFilm) => {
        film.emit(listFilm);
      },
      (error: any) => {
        console.log(error);
      }
    );

    return film;
  }

  getFilmByOmdbID(uid: string, omdbID: string) {
    let film: EventEmitter<Film> = new EventEmitter<Film>();

    this.http.get<Film>('http://localhost:8080/api/movies/omdb/' + uid + '/' + omdbID).subscribe(
      (movie) => {
        film.emit(movie);
      },
      (error: any) => {
        if (error.status === 404) {
          this.errorMessage = "La ressource demandée n'a pas été trouvée."
        } else {
          this.errorMessage = "Une erreur inattendue est survenue"
        }
      }
    );

    return film;
  }

  async getFilmByOmdbIDAsync(uid: string, omdbID: string) {
    try {
      const movie = await fetch('http://localhost:8080/api/movies/omdb/' + uid + '/' + omdbID);
      return movie;
    } catch(error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée."
      } else {
        this.errorMessage = "Une erreur inattendue est survenue"
      }
      return null;
    } 
  
  }

  getListsTitles(){
    this.moviesTitles = [];
    this.http.get<Film>('http://localhost:8080/api/allLists/' + this.utilService.getUserId()).subscribe(
      (listFilm: any) => {
        listFilm.forEach((element: { titrelist: Film | undefined; }) => {
          this.moviesTitles.push(element.titrelist)
        })
        this.utilService.setMoviesTitles(this.moviesTitles)
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getAllListFromUser(idUser: string) {
    let listes: EventEmitter<ListFilm[]> = new EventEmitter<ListFilm[]>();

    this.http.get<ListFilm[]>('http://localhost:8080/api/allLists/' + idUser).subscribe(
      (listFilm) => {
        listes.emit(listFilm);
      },
      (error: any) => {
        console.log(error);
      }
    );

    return listes;
  }


  getOneList(uid: string, titrelist: string) {
    let laliste: EventEmitter<ListFilm> = new EventEmitter<ListFilm>();

    this.http.get<ListFilm>('http://localhost:8080/api/allLists/' + uid + "/" + titrelist).subscribe(
      (listUsers) => {
        laliste.emit(listUsers);
      },
      (error: any) => {
        console.log(error);
      }
    );

    return laliste;
  }

  shareList(destUserId: string, titrelist: string, liste: ListFilm){
    console.log(liste.movies)
      let laliste: EventEmitter<ListFilm> = new EventEmitter<ListFilm>();
      this.http.post<ListFilm>("http://localhost:8080/api/allLists/share", {"uid": destUserId, "titrelist": titrelist + " partagee par " + this.utilService.getUserName(), "movies": liste.movies}).subscribe((res) => {
        laliste.emit(res)
    },
    (error) => {
      console.log(error)
    });
    return laliste

  }

  async existingMovie(id: any){
    const uid = this.utilService.getUserId()
    const url = `http://localhost:8080/api/movies/omdb/${uid}/${id}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data[0]);
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  getUserByMail(userMail: string){
    let user: EventEmitter<User> = new EventEmitter<User>();

    this.http.get<User>('http://localhost:8080/api/users/mail/' + userMail).subscribe(
      (result) => {
        user.emit(result);
      },
      (error: any) => {
        console.log(error);
      }
    );

    return user;
  }


  getUsers() {
    let users: EventEmitter<User[]> = new EventEmitter<User[]>();

    this.http.get<User[]>('http://localhost:8080/api/users').subscribe(
      (listUsers) => {
        users.emit(listUsers);
      },
      (error: any) => {
        console.log(error);
      }
    );

    return users;
  }

  modifierMail(idUser: string, email: string) {
    this.http.put('http://localhost:8080/api/users/' + idUser, {"email": email}).subscribe((log) => {

  }, (error) => {
      console.log(error)
  });
  }

  modifierMDP(idUser: string, mdp: string) {
    let mdpCrypt = this.crypt.cryptMD5(mdp);
    this.http.put('http://localhost:8080/api/users/' + idUser, {"mdp": mdpCrypt}).subscribe((log) => {

  }, (error) => {
      console.log(error)
  });
  }
}
