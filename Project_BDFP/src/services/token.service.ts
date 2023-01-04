import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private token!: string;

  constructor() { }

  login() {
    this.token = "ok";
  }

  getToken() {
    return this.token;
  }

  disconnect() {
    this.token = '';
  }

}
