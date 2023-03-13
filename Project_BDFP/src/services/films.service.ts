import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Film } from '../app/models/film.model';
import { User } from '../app/models/user.models';
import { ListFilm } from '../app/models/listFilm.models';
import { CryptService } from './crypt.service';
import { Observable } from 'rxjs';
import { UtilsService } from 'services/utils.service';
import { ApiServiceService } from './api-service.service';

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

  constructor(
    private http: HttpClient,
    private crypt: CryptService,
    private utilService: UtilsService,
    private api: ApiServiceService
  ) {}

  // Initialise la liste pour l'objet Films de l'utilisateur
  // Ne surtout pas utiliser car est appelé dans addUser
  createListFilmForUser(userId: string) {
    this.http
      .post('http://localhost:8080/api/movies/', { uid: userId, movies: [] })
      .subscribe();
  }

  // ajoute un film à la bd privé de l'utilisateur
  addFilmToList(
    titre: string,
    omdbID: string,
    tmdbID: string,
    userId: string,
    dateVision: string,
    cinema: string,
    accompagnateurs: string,
    avis: string,
    note: string
  ): Observable<Film> {
    let lefilm: EventEmitter<Film> = new EventEmitter<Film>();
    return this.http.post<Film>('http://localhost:8080/api/movies/' + userId, {
      movies: {
        titre: titre,
        omdbID: omdbID,
        tmdbID: tmdbID,
        dateVision: dateVision,
        cinema: cinema,
        accompagnateurs: accompagnateurs,
        avis: avis,
        note: note,
      },
    });
  }

  // ajoute un nouvel utilisateur (inscription)
  addUser(email: string, mdp: string) {
    this.http
      .post('http://localhost:8080/api/users', { email: email, mdp: mdp })
      .subscribe(
        (res) => {
          this.id = res;
          this.createListFilmForUser(this.id._id);
          return res;
        },
        (error) => {
          console.log(error);
          return null;
        }
      );
  }

  // créé une liste pour un utilisateur pour ensuite stocker des films à l'intérieur
  addListToAllLists(idUser: string, titrelist: string) {
    let list: EventEmitter<ListFilm> = new EventEmitter<ListFilm>();
    this.http
      .post<ListFilm>('http://localhost:8080/api/allLists/', {
        uid: idUser,
        titrelist: titrelist,
      })
      .subscribe(
        (log) => {
          list.emit(log);
        },
        (error) => {
          console.log(error);
        }
      );
    return list;
  }

  // créé une liste pour un utilisateur pour ensuite stocker des films à l'intérieur
  addFilmToAllLists(
    titrelist: string,
    titre: string,
    omdbID: string,
    uid: string,
    dateVision: string,
    cinema: string,
    accompagnateurs: string,
    avis: string,
    note: string
  ) {
    let film: EventEmitter<any> = new EventEmitter<any>();
    this.http
      .post<any>(
        'http://localhost:8080/api/allLists/' + uid + '/' + titrelist,
        {
          movies: {
            titre: titre,
            omdbID: omdbID,
            dateVision: dateVision,
            cinema: cinema,
            accompagnateurs: accompagnateurs,
            avis: avis,
            note: note,
          },
        }
      )
      .subscribe(
        (log) => {
          film.emit(log);
        },
        (error) => {
          console.log(error);
        }
      );
    return film;
  }

  deleteAllUsers() {
    this.http.delete('http://localhost:8080/api/users/', {}).subscribe(
      (log) => {},
      (error) => {
        console.log(error);
      }
    );
  }

  deleteAllLists() {
    this.http.delete('http://localhost:8080/api/allLists/', {}).subscribe(
      (log) => {},
      (error) => {
        console.log(error);
      }
    );
  }

  deleteMovieDBById(imdbID: string) {
    let response: EventEmitter<any> = new EventEmitter<any>();
    this.http
      .delete<any>(
        'http://localhost:8080/api/movies/' +
          this.utilService.getUserId() +
          '/movie/' +
          imdbID,
        {}
      )
      .subscribe(
        (log) => {
          response.emit(log);
        },
        (error) => {
          console.log(error);
        }
      );
    return response;
  }

  async deleteMovieByIdAsync(omdbID: string) {
    const uid = this.utilService.getUserId();
    const url = `http://localhost:8080/api/movies/${uid}/movie/${omdbID}`;

    fetch(url, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  }

  deleteMovieFromList(titrelist: string, omdb: string) {
    let response: EventEmitter<any> = new EventEmitter<any>();
    this.http
      .delete<any>(
        'http://localhost:8080/api/allLists/' +
          this.utilService.getUserId() +
          '/' +
          titrelist +
          '/' +
          omdb,
        {}
      )
      .subscribe(
        (log) => {
          response.emit(log);
        },
        (error) => {
          console.log(error);
        }
      );
    return response;
  }

  async deleteMovieFromListAsync(omdbID: string, titrelist: string) {
    const uid = this.utilService.getUserId();

    const url = `http://localhost:8080/api/allLists/${uid}/${titrelist}/${omdbID}`;

    fetch(url, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  }

  async deleteMovieFromAllLists(omdbID: string) {
    const uid = this.utilService.getUserId();

    const url = `http://localhost:8080/api/allLists/${uid}/${omdbID}`;
    fetch(url, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  }

  deleteListOfAllLists(idListe: string) {
    let response: EventEmitter<any> = new EventEmitter<any>();
    this.http
      .delete<any>('http://localhost:8080/api/allLists/' + idListe, {})
      .subscribe(
        (log) => {
          response.emit(log);
        },
        (error) => {
          console.log(error);
        }
      );
    return response;
  }

  deleteAllMovies() {
    this.http.delete('http://localhost:8080/api/movies/', {}).subscribe(
      (log) => {},
      (error) => {
        console.log(error);
      }
    );
  }

  getFilmsByUid(idUser: string) {
    let film: EventEmitter<any[]> = new EventEmitter<any[]>();

    this.http
      .get<any[]>('http://localhost:8080/api/movies/' + idUser)
      .subscribe(
        (listFilm) => {
          film.emit(listFilm);
        },
        (error: any) => {
          console.log(error);
        }
      );

    return film;
  }

  async getFilmsByUidAsync() {
    const uid = this.utilService.getUserId();
    try {
      const movies = await fetch('http://localhost:8080/api/movies/' + uid);
      const movies_jsoned = await movies.json();
      return movies_jsoned;
    } catch (error) {
      console.error(error);
    }
  }

  getFilmByOmdbID(uid: string, omdbID: string) {
    let film: EventEmitter<Film> = new EventEmitter<Film>();

    this.http
      .get<Film>('http://localhost:8080/api/movies/omdb/' + uid + '/' + omdbID)
      .subscribe(
        (movie) => {
          film.emit(movie);
        },
        (error: any) => {
          if (error.status === 404) {
            this.errorMessage = "La ressource demandée n'a pas été trouvée.";
          } else {
            this.errorMessage = 'Une erreur inattendue est survenue';
          }
        }
      );

    return film;
  }

  async getFilmByOmdbIDAsync(uid: string, omdbID: string) {
    try {
      const movie = await fetch(
        'http://localhost:8080/api/movies/omdb/' + uid + '/' + omdbID
      );
      return movie;
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée.";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return null;
    }
  }

  async getFilmsOfUserByDateVision(dateVision: string) {
    let map = new Map<number, string>();
    const uid = this.utilService.getUserId();
    try {
      const movies = await fetch(
        'http://localhost:8080/api/movies/year/' + uid + '/' + dateVision
      );
      const movies_jsoned = await movies.json();
      for (let movie of movies_jsoned) {
        map.set(movie.omdbID, movie.titre);
      }
      return map;
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return null;
    }
  }

  async getFilmsOfUserByLocation(location: string) {
    let map = new Map<number, string>();
    const uid = this.utilService.getUserId();
    try {
      const movies = await fetch(
        'http://localhost:8080/api/movies/location/' + uid + '/' + location
      );
      const movies_jsoned = await movies.json();
      for (let movie of movies_jsoned) {
        map.set(movie.omdbID, movie.titre);
      }
      return map;
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return null;
    }
  }

  async getFilmsOfUserByAccompagnateurs(accompagnateurs: string) {
    let map = new Map<number, string>();
    const uid = this.utilService.getUserId();
    try {
      const movies = await fetch(
        'http://localhost:8080/api/movies/accompagnateurs/' +
          uid +
          '/' +
          accompagnateurs
      );
      const movies_jsoned = await movies.json();
      for (let movie of movies_jsoned) {
        map.set(movie.omdbID, movie.titre);
      }
      return map;
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return null;
    }
  }

  async getFilmsOfUserByNote(note: string) {
    let map = new Map<number, string>();
    const uid = this.utilService.getUserId();
    try {
      const movies = await fetch(
        'http://localhost:8080/api/movies/note/' + uid + '/' + note
      );
      const movies_jsoned = await movies.json();
      for (let movie of movies_jsoned) {
        map.set(movie.omdbID, movie.titre);
      }
      return map;
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return null;
    }
  }

  async getFilmsOfUserByAvis(avis: string) {
    let map = new Map<number, string>();
    const uid = this.utilService.getUserId();
    try {
      const movies = await fetch(
        'http://localhost:8080/api/movies/avis/' + uid + '/' + avis
      );
      const movies_jsoned = await movies.json();
      for (let movie of movies_jsoned) {
        map.set(movie.omdbID, movie.titre);
      }
      return map;
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return null;
    }
  }

  getListsTitles() {
    this.moviesTitles = [];
    this.http
      .get<Film>(
        'http://localhost:8080/api/allLists/' + this.utilService.getUserId()
      )
      .subscribe(
        (listFilm: any) => {
          listFilm.forEach((element: { titrelist: Film | undefined }) => {
            this.moviesTitles.push(element.titrelist);
          });
          this.utilService.setMoviesTitles(this.moviesTitles);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getAllListFromUser(idUser: string) {
    let listes: EventEmitter<ListFilm[]> = new EventEmitter<ListFilm[]>();

    this.http
      .get<ListFilm[]>('http://localhost:8080/api/allLists/' + idUser)
      .subscribe(
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

    this.http
      .get<ListFilm>(
        'http://localhost:8080/api/allLists/' + uid + '/' + titrelist
      )
      .subscribe(
        (listUsers) => {
          laliste.emit(listUsers);
        },
        (error: any) => {
          console.log(error);
        }
      );

    return laliste;
  }

  async getOneListAsync(titrelist: string) {
    const uid = this.utilService.getUserId();
    try {
      const moviesList = await fetch(
        'http://localhost:8080/api/allLists/' + uid + '/' + titrelist
      );
      const moviesList_jsoned = await moviesList.json();
      return moviesList_jsoned[0];
    } catch (error) {
      console.log(error);
    }
  }

  shareList(destUserId: string, titrelist: string, liste: ListFilm) {
    console.log(liste.movies);
    let laliste: EventEmitter<ListFilm> = new EventEmitter<ListFilm>();
    this.http
      .post<ListFilm>('http://localhost:8080/api/allLists/share', {
        uid: destUserId,
        titrelist:
          titrelist + ' partagee par ' + this.utilService.getUserName(),
        movies: liste.movies,
      })
      .subscribe(
        (res) => {
          laliste.emit(res);
        },
        (error) => {
          console.log(error);
        }
      );
    return laliste;
  }

  updateMovieInfo(movie: Film) {
    const uid = this.utilService.getUserId();

    const omdbID = movie.omdbID;

    const url = `http://localhost:8080/api/movies/${uid}/${omdbID}`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avis: movie.avis,
        accompagnateurs: movie.accompagnateurs,
        note: movie.note,
        cinema: movie.cinema,
        dateVision: movie.dateVision,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        console.log('Data updated successfully:', data);
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  }

  getUserByMail(userMail: string) {
    let user: EventEmitter<User> = new EventEmitter<User>();

    this.http
      .get<User>('http://localhost:8080/api/users/mail/' + userMail)
      .subscribe(
        (result) => {
          user.emit(result);
        },
        (error: any) => {
          throw new Error(error);
        }
      );

    return user;
  }

  async getUserByEmailAndPassword(usermail: string, password: string) {

    const url = `http://localhost:8080/api/users/mail/${usermail}/password/${password}`

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        return data
      })
      .catch(error => {
        console.error(error);
        return false
      });
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

  modifierMail(email: string) {
    const uid = this.utilService.getUserId();
    this.http
      .put('http://localhost:8080/api/users/' + uid, { email: email })
      .subscribe(
        (log) => {},
        (error) => {
          console.log(error);
        }
      );
  }

  modifierMDP(mdp: string) {
    const uid = this.utilService.getUserId();
    let mdpCrypt = this.crypt.cryptMD5(mdp);
    this.http
      .put('http://localhost:8080/api/users/' + uid, { mdp: mdpCrypt })
      .subscribe(
        (log) => {},
        (error) => {
          console.log(error);
        }
      );
  }
}
