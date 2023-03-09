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
    let sessionObject
    sessionObject = localStorage.getItem('sessionObject');
    return sessionObject;
  }

  setSession() {
    let startDate = new Date();
    let expires = new Date(startDate);
    expires.setDate(expires.getDate() + 1)
    let username = this.util.getUserName();
    let userID = this.util.getUserId();
    let sessionObject = {expiresAt: expires, username: username, userID: userID}

    localStorage.setItem('sessionObject', JSON.stringify(sessionObject));
  }

  disconnect() {
    this.token = '';
    localStorage.removeItem('sessionObject');
  }

  isSessionActive() {
    //let currentDate = new Date();
    let currentDate = Date.now();
    let sessionObject = JSON.parse(this.getSession() || '{}');
    let expirationDate = sessionObject.expiresAt;
    if(currentDate < Date.parse(expirationDate)) {
        return true;
    } else {
      return false;
    }
  }




}
