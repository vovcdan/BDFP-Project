import { Injectable } from '@angular/core';
import {Md5} from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class CryptService {

  constructor() { }

  cryptMD5(mot: string) {
    const md5 = new Md5();

    return(Md5.hashStr(mot));
  }
}
