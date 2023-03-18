import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Film } from '../app/models/film.model';
import { User } from '../app/models/user.models';
import { ListFilm } from '../app/models/listFilm.models';
import { CryptService } from './crypt.service';
import { Observable } from 'rxjs';
import { UtilsService } from 'services/utils.service';
import { ApiServiceService } from './api-service.service';
import { notEqual } from 'assert';

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

  createHistoryForUser(userID: string) {

    const url = `http://localhost:8080/api/historyField/`;


    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: userID
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        console.log('Data added successfully.');
      })
      .catch((error) => {
        console.error('Error updating data:', error);
      });
  }

  async createListFilmForuserAsync(){
    const uid = this.utilService.getUserId()

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uid: uid, movies: []})
    };

    const url = "http://localhost:8080/api/movies";

    fetch(url, options).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Une erreur est survenue")
      }
    })
    .catch(error => {
      console.error("Error ", error)
    })
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

  async addFilmToListAsync(titre: string, omdbID: string, tmdbID: string, dateVision: string, cinema: string, accompagnateurs: string, avis: string, note: string){
    const uid = this.utilService.getUserId()

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uid: uid, movies: {
        titre: titre,
        omdbID: omdbID,
        tmdbID: tmdbID,
        dateVision: dateVision,
        cinema: cinema,
        accompagnateurs: accompagnateurs,
        avis: avis,
        note: note,
      }})
    };

    const url = `http://localhost:8080/api/movies/${uid}`;

    await fetch(url, options).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Une erreur est survenue")
      }
    })
    .catch(error => {
      console.error("Error ", error)
    })
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

  async addUserAsync(email: string, mdp: string){
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email, mdp: mdp})
    };

    const url = `http://localhost:8080/api/users`;

    await fetch(url, options).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Une erreur est survenue")
      }
    }).then(data => {
      if(data) {
        this.createListFilmForUser(data._id);
        this.createHistoryForUser(data._id);
        this.utilService.connect();
        this.utilService.setUserName(data.email);
        this.utilService.setUserId(data._id);
      }
    })
    .catch(error => {
      console.error("Error ", error)
    })
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

  async addListToAllListsAsync(titrelist: string){
    const uid = this.utilService.getUserId()

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uid: uid, titrelist: titrelist})
    };

    const url = "http://localhost:8080/api/allLists";

    return fetch(url, options).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Une erreur est survenue")
      }
    })
    .catch(error => {
      console.error("Error ", error)
    })
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

  async addFilmToAllListsAsync(
    titrelist: string,
    titre: string,
    omdbID: string,
    dateVision: string,
    cinema: string,
    accompagnateurs: string,
    avis: string,
    note: string
  ){
    const uid = this.utilService.getUserId()

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        movies: {
          titre: titre,
          omdbID: omdbID,
          dateVision: dateVision,
          cinema: cinema,
          accompagnateurs: accompagnateurs,
          avis: avis,
          note: note,
        },
      })
    };

    const url = `http://localhost:8080/api/allLists/${uid}/${titrelist}`;

    await fetch(url, options).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Une erreur est survenue")
      }
    })
    .catch(error => {
      console.error("Error ", error)
    })
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

  async isMovieInDatabase(uid: string, omdbID: string) {
    try {
      const movie = await fetch(
        'http://localhost:8080/api/movies/omdb/' + uid + '/' + omdbID
      );
      const movieData = await movie.json();
      return Boolean(movieData); // Returns true if movie data exists, false otherwise
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée.";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return false;
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

  async getOneCommonList(titrelist: string){
    const uid = this.utilService.getUserId()

    try{
      const commonlist = await fetch(`http://localhost:8080/api/commonList/${uid}/${titrelist}`)
      const commonlist_jsoned = await commonlist.json()
      console.log(commonlist_jsoned)
      return commonlist_jsoned[0]
    } catch(error) {
      console.error(error)
    }
  }

  // getOneListAsync pour la destinaire
  async getOneListAsyncDestinaire(titrelist: string, uid: string) {
    try {
      const moviesList = await fetch(
        'http://localhost:8080/api/allLists/' + uid + '/' + titrelist +" partagee par " + this.utilService.getUserName()
      );
      const moviesList_jsoned = await moviesList.json();
      console.log(moviesList_jsoned[0])
      return moviesList_jsoned[0];
    } catch (error) {
      console.log(error);
    }
  }

  async shareListAsync(dest_id: string, list: ListFilm){
    const uid = this.utilService.getUserId()

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: dest_id,
        titrelist: list.titrelist + ' partagee par ' + this.utilService.getUserName(),
        movies: list.movies,
      })
    };

    const url = "http://localhost:8080/api/allLists/share";

    fetch(url, options).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Une erreur est survenue")
      }
    })
    .catch(error => {
      console.error("Error ", error)
    })
  }

  updateMovieInfo(movie: Film) {
    const uid = this.utilService.getUserId();

    const omdbID = movie.omdbID;

    const url = `http://localhost:8080/api/movies/${uid}/${omdbID}`;

    const url2 = `http://localhost:8080/api/allLists/${uid}/${omdbID}`;

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

    fetch(url2, {
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

  async getUserByMailAsync(usermail: string) {

    const url = `http://localhost:8080/api/users/mail/${usermail}`

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        return data
      })
      .catch(error => {
        console.error(error);
      });
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

  async getMovieFromOneList(omdbID: string) {
    const uid = this.utilService.getUserId();
    const list_title = this.utilService.getCurrentListeName();
    const url = `http://localhost:8080/api/allLists/${uid}/${list_title}/${omdbID}`;

    try {
      let data = await fetch(url);
      let movie = data.json();
      return movie;
    }catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return null;
    }
  }

  async isListShared(list_title: string) {
    const uid = this.utilService.getUserId();
    const url = `http://localhost:8080/api/allLists/isShared/${uid}/${list_title}`

    try {
    let data = await fetch(url);
    return data;

    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return null;
    }
  }


  addCinemaHistory(cinema: string) {
    const uid = this.utilService.getUserId()

    const options = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cinema: cinema
      })
    };

    const url = `http://localhost:8080/api/historyField/add/cinema/${uid}`;

    fetch(url, options).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    })
    .then((data) => {
      console.log('Data added successfully.');
    })
    .catch((error) => {
      console.error('Error updating data:', error);
    });
  }

  addAccompagnateursHistory(accompagnateurs: string) {
    const uid = this.utilService.getUserId()

    const options = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accompagnateurs: accompagnateurs
      })
    };

    const url = `http://localhost:8080/api/historyField/add/accompagnateurs/${uid}`;

    fetch(url, options).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    })
    .then((data) => {
      console.log('Data added successfully.');
    })
    .catch((error) => {
      console.error('Error updating data:', error);
    });
  }

  async getCinemaHistory() {
    const uid = this.utilService.getUserId()

    const url = `http://localhost:8080/api/historyField/get/cinema/${uid}`;

    try {
      let data = await fetch(url);
      let data_json = await data.json();
      return data_json;
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return [];
    }
  }

  async getAccompagnateursHistory() {
    const uid = this.utilService.getUserId()

    const url = `http://localhost:8080/api/historyField/get/accompagnateurs/${uid}`;

    try {
      let data = await fetch(url);
      let data_json = await data.json();
      return data_json;
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = "La ressource demandée n'a pas été trouvée";
      } else {
        this.errorMessage = 'Une erreur inattendue est survenue';
      }
      return [];
    }
  }

  async deleteAccompagnateursHistory(accompagnateurs: string) {
    const uid = this.utilService.getUserId()

    const options = {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accompagnateurs: accompagnateurs
      })
    };

    const url = `http://localhost:8080/api/historyField/delete/accompagnateurs/${uid}`;

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Data deleted successfully.');
      return data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  async deleteCinemaHistory(cinema: string) {
    const uid = this.utilService.getUserId()

    const options = {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cinema: cinema
      })
    };

    const url = `http://localhost:8080/api/historyField/delete/cinema/${uid}`;

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Data deleted successfully.');
      return data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }


  async createCommonList(titrelist: string){
    const uid = this.utilService.getUserId()

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uid: uid, titrelist: titrelist})
    };

    const url = "http://localhost:8080/api/commonList/";

    return fetch(url, options).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Une erreur est survenue")
      }
    })
    .catch(error => {
      console.error("Error ", error)
    })
  }

  async getAllCommonListOfUser(){
    const uid = this.utilService.getUserId()
    try {
      const movies = await fetch('http://localhost:8080/api/commonList/' + uid);
      const movies_jsoned = await movies.json();
      return movies_jsoned;
    } catch (error) {
      console.error(error);
    }
  }

  async addUserToCommonList(newUserId: string, titrelist: string){
    const uid = this.utilService.getUserId()

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({newUserId: newUserId})
    };

    const url = `http://localhost:8080/api/commonList/addUser/${uid}/${titrelist}`;

    return fetch(url, options).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Une erreur est survenue")
      }
    })
    .catch(error => {
      console.error("Error ", error)
    })
  }

  async addMovieToCommonList(titrelist: string, movieTitle: string, omdbID: string, tmdbID: string){
    const uid = this.utilService.getUserId()


    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({movie: {
        titre: movieTitle,
        omdbID: omdbID,
        tmdbID: tmdbID
      }})
    };

    const url = `http://localhost:8080/api/commonList/movies/${uid}/${titrelist}`;

    return fetch(url, options).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error("Une erreur est survenue")
      }
    })
    .catch(error => {
      console.error("Error ", error)
    })
  }

  async getMovieFromOneCommonList(titrelist: string, omdbID: string){
    const uid = this.utilService.getUserId()
    try {
      const movies = await fetch(`http://localhost:8080/api/commonList/${uid}/${titrelist}/${omdbID}`);
      const movies_jsoned = await movies.json();
      return movies_jsoned[0];
    } catch (error) {
      console.error(error);
    }
  }

  async deleteMovieFromCommonListAsync(omdbID: string, titrelist: string) {
    const uid = this.utilService.getUserId();

    const url = `http://localhost:8080/api/commonList/${uid}/${titrelist}/${omdbID}`;

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

  async deleteListFromCommonListAsync(titrelist: string) {
    const uid = this.utilService.getUserId();

    const url = `http://localhost:8080/api/commonList/${uid}/${titrelist}`;

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

  async getMembersIDFromCommonList(titrelist: string){
    const uid = this.utilService.getUserId()
    const titreliste = this.utilService.getListName()
    const url = `http://localhost:8080/api/commonList/${uid}/${titreliste}`
    console.log(url)
    try {
      const members = await fetch(url)
      const members_jsoned = await members.json();
      console.log(members_jsoned[0].uids)
      const names = await this.getMembersNamesByUids(members_jsoned[0].uids)
      console.log(names)
      return names;
    } catch(error) {
      console.error(error)
      return [];
    }
  }

  async getMembersNamesByUids(uids: [string]){
    try {
      let names: Array<string> = new Array;
      for(let i = 0; i< uids.length; i++){
        const uid = uids[i]
        const name = await fetch(`http://localhost:8080/api/users/members/${uid}`)
        const name_jsoned:string = await name.json()
        names.push(name_jsoned)
      }
      return names;
    } catch(error) {
      console.error(error)
      return [];
    }
  }

}
