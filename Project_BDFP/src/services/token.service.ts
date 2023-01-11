import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token!: string;

  constructor(private util: UtilsService) { }

  login() {
    this.token = "ok";
    this.setSession();
  }

  getToken() {
    return this.token;
  }

  getSession() {
    var sessionObject
    sessionObject = localStorage.getItem('sessionObject');
    return sessionObject;
  }

  setSession() {
    var startDate = new Date();
    var expires = new Date(startDate);
    expires.setDate(expires.getDate() + 1)
    var username = this.util.getUserName();
    var userID = this.util.getUserId();
    var sessionObject = {expiresAt: expires, username: username, userID: userID}

    localStorage.setItem('sessionObject', JSON.stringify(sessionObject));
  }

  disconnect() {
    this.token = '';
    localStorage.removeItem('sessionObject');
  }

  isSessionActive() {
    //var currentDate = new Date();
    var currentDate = Date.now();
    var sessionObject = JSON.parse(this.getSession() || '{}');
    var expirationDate = sessionObject.expiresAt;
    if(currentDate < Date.parse(expirationDate)) {
        return true;
    } else {
      return false;
    }
  }




}
