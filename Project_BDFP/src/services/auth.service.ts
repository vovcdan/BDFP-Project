import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private token: TokenService, private router: Router) {}

  // Protected URL from no logins
  // if no login -> redirect to login section
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.token.getToken();
    const sessionActive = this.token.isSessionActive();
    if (token || sessionActive) {
      return true;
    } else {
      this.router.navigateByUrl('/connect');
      return false;
    }
  }
}
